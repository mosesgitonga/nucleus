from flask import Flask
from models.engine import Storage 
from routes.auth import auth_bp

app = Flask(__name__)

app.register_blueprint(auth_bp)
storage = Storage()
storage.reload()


if __name__ == "__main__":
    app.run(debug=True)