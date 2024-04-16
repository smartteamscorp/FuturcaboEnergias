import os

SECRET_KEY = 'abcd'

class Config:
    # Outras configurações do aplicativo

    # Diretório para upload de arquivos
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')

    # Definindo a pasta para armazenar os feedbacks
    FEEDBACK_FOLDER = os.path.join(os.getcwd(), 'feedbacks')

