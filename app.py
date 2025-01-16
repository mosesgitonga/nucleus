from flask import Flask 
from models.engine import Storage

app = Flask(__name__)
storage = Storage()
storage.reload()


if __name__ == "__main__":
    app.run()