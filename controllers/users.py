from models.engine import Storage
from models.models import User
import bcrypt 
import logging 
import re
from flask import request
import uuid

from services.helpers import Helper
storage = Storage()
helper = Helper()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class Users():
    def __init__(self):
        self.storage = storage 

    def create_user(self, data):
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')
        
        if not self._validate_email(email):
            return {"message": "Invalid Email Format"}, 403

        if not self._validate_password(password):
            return {"message": "password must be atleast 8 chars, a capital letter, small letter and a digit"}, 403

        existing_user = self.storage.get(User, email=email)
        if existing_user:
            logging.info("user already exists")            
            return {"message": "Invalid email or password"}, 409

        password_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt()
        password_hash = bcrypt.hashpw(password_bytes, salt)

        try:
            ip = request.headers.get('X-Forwarded-For', request.remote_addr)
            country = helper.get_country_from_ip(ip)

            new_user = User(
                id = uuid.uuid4(),
                email=email,
                password=password_hash,
                country=country,
                role=role
            )
        
            self.storage.new(new_user)
            self.storage.save() 
            new_user = self.storage.get(User)
            if not new_user:
                return {"message": "user not created"}, 404
            return {"message": "User added successfully"}, 201
        except Exception as e:
            logging.error(f"Error while creating user: {e}")
            return {"error": "Internal Server Error"}, 500

    @staticmethod
    def _validate_email(email):
        regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(regex, email)

    @staticmethod
    def _validate_password(password):
        return len(password) >= 8 and any(c.isdigit() for c in password) and any(c.isalpha() for c in password)

    
