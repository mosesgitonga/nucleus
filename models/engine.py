from sqlalchemy import create_engine, Table, func, or_ 
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.orm.exc import NoResultFound
import load_dotenv
import os 
import logging 

logging.basicConfig(level=logging.INFO)
load_dotenv()

class Storage():
    def __init__(self):
    
        self.production_db = ""
        if os.getenv('dev_env') = 'development_env':
            self.db_uri = os.getenv('CROPSHIELD_DEVELOPMENT_DB')
        else:
            self.db_uri = os.getenv('CROPSHIELD_PRODUCTION_DB')

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
        pass

        