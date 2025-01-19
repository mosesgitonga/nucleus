import bcrypt 
import requests
import logging
import os 
import load_dotenv
from models.engine import Storage
from models.models import User

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


load_dotenv()

class Auth():
    def __init__(self):
        self.storage = Storage()

    def login(self, data):
        """
        Handles user login and generates a JWT token if successful.
        
        Args:
            data (dict): A dictionary containing user-provided credentials (email and password).
        
        Returns:
            dict: A response containing the access token or an error message.
        """
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            logging.info("Email or password missing")
            return {"message": "Email and password are required"}, 400

        secret = os.getenv("SECRET")
        if not secret:
            logging.error("JWT secret key not found in environment variables")
            return {"message": "Server configuration error"}, 500

        existing_user = self.storage.get(User, email=email)
        if not existing_user:
            logging.info("User not found")
            return {"message": "User not found"}, 404

        if not bcrypt.checkpw(password.encode('utf-8'), existing_user.password.encode('utf-8')):
            logging.info("Invalid email or password")
            return {"message": "Invalid email or password"}, 401

        token_expiry = datetime.datetime.utcnow() + datetime.timedelta(hours=19)
        payload = {
            "exp": token_expiry,
            "iat": datetime.datetime.utcnow(),
            "user_id": existing_user.id,
            "email": existing_user.email
        }
        access_token = jwt.encode(payload, secret, algorithm="HS256")

        logging.info("User logged in successfully")
        return {"access_token": access_token}, 200

        