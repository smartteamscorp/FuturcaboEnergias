
from flask import Flask
from config import SECRET_KEY

app = Flask(__name__, static_folder='static')
app.config['SECRET_KEY'] = SECRET_KEY

from app import views  # Se as rotas estão definidas em views.py
