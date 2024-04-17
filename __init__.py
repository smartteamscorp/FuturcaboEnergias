from flask import Flask
from config import SECRET_KEY
from app import views

app = Flask(__name__)
app.config['SECRET_KEY'] = SECRET_KEY

