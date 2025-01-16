import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
from contextlib import contextmanager
from models.models import User, Disease, Crop, Image, Base 

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

load_dotenv()


class Storage:
    def __init__(self):
        self.db_uri = os.getenv('CROPSHIELD_DEVELOPMENT_DB_URL')
        
        if not self.db_uri:
            logging.error("Database URI not set in environment variables.")
            raise ValueError("Database URI is missing")

        self.engine = create_engine(
            self.db_uri,
            pool_size=20,
            max_overflow=30,
            pool_timeout=25,
            pool_recycle=3600
        )

        self.Session = scoped_session(sessionmaker(bind=self.engine, expire_on_commit=False))

    @contextmanager
    def get_session(self):
        """Provides a session for use within a context manager."""
        session = self.Session()
        try:
            yield session
            session.commit()
        except Exception as e:
            session.rollback()
            logging.error(f"Session rolled back due to error: {e}")
            raise
        finally:
            session.close()

    def reload(self):
        """Reload the database schema (creates all tables)."""
        try:
            Base.metadata.create_all(self.engine)
            logging.info("Database reloaded successfully.")
        except Exception as e:
            logging.error(f"Internal Server Error: {e}")
            raise  # Re-raise the exception after logging

        
    def new(self, obj):
        try:
            with self.get_session() as session:
                session.add(obj)
                logging.info("New onbject created succesfully")
        except Exception as e:
            logging.error("Internal Server Error: {e}")

    def save(self):
        try:
            with self.get_session() as session:
                session.commit()
                logging.info('Session commited successfully')
        except Exception as e:
            logging.error(f"Internal Server Error: {e}")
            
    def delete(self, obj=None):
        try:
            with self.get_session() as session:
                session.delete(obj)
                logging.info(f"{obj.__class__.__name__} deleted: {obj}")
        except Exception as e:
            logging.error(f"an error occured while deleting object: {e}")

    def get(self, cls, **kwargs):
        try:
            with self.get_session() as session:
                filters = [getattr(cls, key) == value for key, value in kwargs.items()]
                result = session.query(cls).filter(*filters).first()
                logging.info(f'Fetched {cls.__name__}: {result}')
                return result
        except NoResultFound:
            logging.info(f'No result found for {cls.__name__} with filters: {kwargs}')
            return None
        except Exception as e:
            logging.error(f'An error occurred while fetching {cls.__name__} object: {e}')
            return None

    def get_all(self, cls, page=1, per_page=30, use_pagination=False, use_and=False, **kwargs):
        """
            Fetch all objects of a given class with optional filtering and pagination.
            
            Allows dynamic switching between AND/OR conditions.
            
            :param cls: SQLAlchemy model class
            :param page: Page number for pagination
            :param per_page: Number of items per page
            :param use_pagination: Whether to apply pagination
            :param use_or: Whether to use OR logic for filters (default is AND)
            :param kwargs: Filtering criteria
            :return: List of results or SQLAlchemy query object
        """
        try:
            with self.get_session() as session:
                valid_filters = {key: value for key, value in kwargs.items() if hasattr(cls, key)}

                query = session.query(cls)

                if use_and:
                    for key, value in valid_filters.items():
                        query = query.filter(getattr(cls, key) == value) 
                else:
                    filters = [getattr(cls, key) == value for key, value in valid_filters.items()]
                    query = query.filter(or_(*filters))  


                if use_pagination:
                    query = query.limit(per_page).offset((page - 1) * per_page)

                results = query.all()
                logging.info(f'Fetched {len(results)} {cls.__name__} objects with filters: {kwargs}')
                return results
        except Exception as e:
            logging.error(f"Error fetching {cls.__name__} objects: {e}")
            raise
