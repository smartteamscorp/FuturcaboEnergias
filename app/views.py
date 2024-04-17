from flask import render_template, redirect, url_for, flash, request, current_app
from app import app
from app.forms import RegistrationForm, LoginForm
from werkzeug.utils import secure_filename
from flask import jsonify
import pandas as pd
import os, openpyxl
from config import Config
from flask import Flask
from datetime import datetime
from flask import session
from openpyxl import Workbook
from openpyxl.utils import get_column_letter
from openpyxl.styles import Alignment
import xlsxwriter





@app.route('/')
def landing():
    return render_template('landing.html')


# Verifica se o diretório 'logs' existe, se não, cria
logs_dir = 'logs'
if not os.path.exists(logs_dir):
    os.makedirs(logs_dir)

# Caminho para o arquivo 'users.xlsx'
users_file = os.path.join(logs_dir, 'users.xlsx')

# Verifica se o arquivo 'users.xlsx' existe, se não, cria
if not os.path.isfile(users_file):
    df = pd.DataFrame(columns=['Username', 'Email', 'Password'])
    df.to_excel(users_file, index=False)


@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        user_df = pd.DataFrame({
            'Username': [form.username.data],
            'Email': [form.email.data],
            'Password': [form.password.data]
        })
        try:
            existing_df = pd.read_excel(users_file)
            updated_df = existing_df.append(user_df, ignore_index=True)
            updated_df.to_excel(users_file, index=False)
            flash('Registration successful. You can now log in.', 'success')
            return redirect(url_for('login'))
        except FileNotFoundError:
            user_df.to_excel(users_file, index=False)
            flash('Registration successful. You can now log in.', 'success')
            return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)


@app.route('/get_logged_user')
def get_logged_user():
    # Obtém o nome de usuário da sessão, se existir
    return session.get('logged_user', 'Convidado')


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user_df = pd.read_excel(users_file)
        user = user_df[(user_df['Username'] == form.username.data) & (user_df['Password'] == form.password.data)]
        if not user.empty:
            flash('Login successful!', 'success')
            session['logged_user'] = form.username.data  # Armazena o nome de usuário na sessão
            return redirect(url_for('main'))
        else:
            flash('Login unsuccessful. Please check your username and password.', 'danger')
    return render_template('login.html', title='Login', form=form)

# Rota de logout
@app.route('/logout')
def logout():
    session.pop('username', None)  # Remove o nome de usuário da sessão
    flash('Logout successful.', 'success')
    return redirect(url_for('login'))

@app.route('/main')
def main():
    return render_template ('main.html')

@app.route('/menu')
def menu():
    return render_template('menu.html')


@app.route('/feedbacks')
def feedbacks():
    return render_template('feedbacks.html')


@app.route('/gestao_carteira')
def gestao_carteira():
    return render_template('gestao_clientes_wallet.html')




@app.route('/admin')
def admin():
    return render_template('admin.html')

# Configuração do diretório de uploads
app.config['UPLOAD_FOLDER'] = 'uploads'

@app.route('/upload_celula', methods=['POST'])
def upload_celula():
    if request.method == 'POST':
        # Verifica se o arquivo está presente no request
        if 'file' not in request.files:
            flash('Nenhum arquivo enviado', 'error')
            return redirect(request.url)
        file = request.files['file']
        # Verifica se o arquivo é um arquivo xlsx
        if file.filename == '':
            flash('Nenhum arquivo selecionado', 'error')
            return redirect(request.url)
        if file and file.filename.rsplit('.', 1)[1].lower() == 'xlsx':
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            flash('Upload realizado com sucesso', 'success')
            return redirect(url_for('admin'))
        else:
            flash('Apenas arquivos xlsx são permitidos', 'error')
            return redirect(request.url)


@app.route('/get_uploaded_files')
def get_uploaded_files():
    uploads_dir = os.path.join(app.config['UPLOAD_FOLDER'])
    if os.path.exists(uploads_dir):
        files = os.listdir(uploads_dir)
        return jsonify(files)
    else:
        return jsonify([])


@app.route('/get_dados/<nome_arquivo>')
def get_dados(nome_arquivo):
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], f'{nome_arquivo}')
    if os.path.exists(filepath):
        df = pd.read_excel(filepath)
        
        # Aqui você pode selecionar todas as informações do arquivo e retorná-las como um dicionário
        # Certifique-se de incluir apenas as informações relevantes que deseja mostrar ao usuário
        
        # Por exemplo, você pode selecionar apenas algumas colunas específicas
        dados_selecionados = df[['Morada', 'NUMERO', 'ANDAR', 'Tecnologia', 'Estado Cobertura', 'Coordenadas']]
        
        # Converte os dados selecionados para o formato JSON e retorna
        return jsonify(dados_selecionados.to_dict(orient='records'))
    else:
        return jsonify({'error': 'Arquivo não encontrado'}), 404


@app.route('/get_numeros/<morada>/<celula>')
def get_numeros(morada, celula):
    try:
        # Remover espaços em branco extras no valor da morada
        morada = morada.strip()
        
        # Caminho para o arquivo com os dados
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], celula)
        
        # Verifica se o arquivo existe
        if os.path.exists(filepath):
            # Lê o arquivo Excel
            df = pd.read_excel(filepath)
            
            # Filtra os dados para obter os números correspondentes à morada selecionada
            numeros = df.loc[df['Morada'].str.strip() == morada, 'NUMERO'].unique().tolist()
            
            # Adicionar logs de depuração para verificar a resposta JSON
            print("Números correspondentes à morada selecionada:", numeros)
            
            # Retorna os números como um JSON
            return jsonify(numeros)
        else:
            # Se o arquivo não existe, retorna uma mensagem de erro
            return jsonify({'error': 'Arquivo não encontrado'}), 404
    except Exception as e:
        # Em caso de exceção, retorna uma mensagem de erro
        return jsonify({'error': str(e)}), 500
    
# Definindo a pasta para armazenar os feedbacks
app.config['FEEDBACK_FOLDER'] = os.path.join(os.getcwd(), 'feedbacks')

# Criando a pasta de feedbacks se ela ainda não existir
if not os.path.exists(app.config['FEEDBACK_FOLDER']):
    os.makedirs(app.config['FEEDBACK_FOLDER'])


@app.route('/enviar_feedback', methods=['POST'])
def enviar_feedback():
    # Obter os dados do formulário enviados pelo cliente
    data = request.json
    
    # Nome do arquivo Excel onde os feedbacks serão armazenados
    filepath = os.path.join(app.config['FEEDBACK_FOLDER'], 'feedbacks.xlsx')
    
    # Verificar se o arquivo existe, se não existir, cria um novo
    if not os.path.exists(filepath):
        # Se o arquivo não existe, criamos um DataFrame vazio
        df = pd.DataFrame()
    else:
        # Se o arquivo existe, carregamos os dados existentes do arquivo
        df = pd.read_excel(filepath)
    
    # Adicionar os dados do formulário ao DataFrame
    df = df.append(data, ignore_index=True)
    
    # Remover colunas duplicadas (se houver)
    df = df.loc[:, ~df.columns.duplicated()]
    
    # Adicionar a data e hora da gravação do questionário
    df['Data e Hora'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Adicionar o usuário logado na página
    user = get_logged_user() or "Convidado"
    df['User'] = user
    
    # Salvar os dados atualizados no arquivo Excel
    df.to_excel(filepath, index=False)
    
    return 'Feedback enviado com sucesso!', 200


@app.route('/marcar_acao', methods=['POST'])
def marcar_acao():
    # Obter os dados enviados pelo cliente
    data = request.json
    
    # Extrair os dados relevantes
    acao = data.get('acao')
    celula_selecionada = data.get('celulaSelecionada')
    morada_selecionada = data.get('moradaSelecionada')
    numero_selecionado = data.get('numeroSelecionado')
    
    # Caminho para o arquivo Excel onde os dados serão atualizados
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], celula_selecionada)
    
    try:
        # Carregar o arquivo Excel
        df = pd.read_excel(filepath)
        
        # Localizar a linha correspondente ao número selecionado
        linha_selecionada = df.index[df['NUMERO'] == numero_selecionado].tolist()[0]
        
        # Marcar a ação na coluna "stats"
        if acao == 'nao_abre_nao_responde':
            df.loc[linha_selecionada, 'stats'] = 'N/A Não Abre/Não Responde'
        elif acao == 'marcar_visita':
            # Aqui você pode lidar com a funcionalidade de marcar visita, como abrir um calendário para o usuário
            pass
        elif acao == 'marcar_oportunidade':
            df.loc[linha_selecionada, 'stats'] = 'Marcar Oportunidade'
        elif acao == 'fecho':
            df.loc[linha_selecionada, 'stats'] = 'Fecho'
        
        
        # Adicionar o usuário logado na página
        # Se você estiver usando algum sistema de autenticação, substitua esta linha pelo código adequado para obter o usuário logado
        df.loc[linha_selecionada, 'User'] = 'Nome do Usuário'
        
        # Salvar as alterações no arquivo Excel
        df.to_excel(filepath, index=False)
        
        return 'Ação marcada com sucesso!', 200
    except Exception as e:
        return f'Erro ao marcar ação: {str(e)}', 500


# Função para obter o usuário logado
def logged_user():
    # Obtém o nome de usuário da sessão, se existir
    return session.get('logged_user', 'Convidado')


FEEDBACK_FOLDER = os.path.join(os.getcwd(), 'feedbacks')

def get_current_date():
    return datetime.now().strftime("%Y-%m-%d")

def read_feedbacks(logged_user):
    try:
        # Lê o arquivo de feedbacks
        feedbacks_df = pd.read_excel(os.path.join(FEEDBACK_FOLDER, 'feedbacks.xlsx'))
        print("Dados lidos do arquivo:")
        print(feedbacks_df)
        
        # Filtra os dados para o usuário logado
        filtered_df = feedbacks_df[feedbacks_df['User'] == logged_user]
        
        return filtered_df
    except FileNotFoundError:
        print("Arquivo 'feedbacks.xlsx' não encontrado.")
        return None
    
@app.route('/raill_trail')
def raill_trail():
    # Verifica se o usuário está autenticado
    if 'logged_user' in session:
        logged_username = session['logged_user']
        
        # Obter a data atual no formato YYYY-MM-DD
        current_date = get_current_date()
        
        # Lê os dados do arquivo Excel filtrados para o usuário logado
        feedbacks_df = read_feedbacks(logged_username)
        
        if feedbacks_df is not None:
            # Converte a coluna 'Data e Hora' para o tipo de dados de data e hora
            feedbacks_df['Data e Hora'] = pd.to_datetime(feedbacks_df['Data e Hora'])
            
            # Filtra os dados com base na data atual
            filtered_df = feedbacks_df[feedbacks_df['Data e Hora'].dt.strftime("%Y-%m-%d") == current_date]
            
            # Converte os dados do DataFrame filtrado para uma lista de dicionários
            data = filtered_df.to_dict('records')
            
            # Renderiza a página HTML com os dados filtrados
            return render_template('raill_trail.html', data=data, logged_user=logged_username, current_date=current_date)
        else:
            return "Falha ao ler os dados do arquivo."
    else:
        return "Nenhum usuário logado. Por favor, faça login primeiro."
    


# Define a pasta onde os arquivos de carteira de clientes de cada usuário serão armazenados
CLIENT_PORTFOLIO_FOLDER = os.path.join(os.getcwd(), 'client_portfolios')

def read_feedbacks(logged_user):
    try:
        # Lê o arquivo de feedbacks
        feedbacks_df = pd.read_excel(os.path.join(FEEDBACK_FOLDER, 'feedbacks.xlsx'))
        print("Dados lidos do arquivo:")
        print(feedbacks_df)
        
        # Filtra os dados para o usuário logado
        filtered_df = feedbacks_df[feedbacks_df['User'] == logged_user]

        # Converter os valores int64 para int
        filtered_df = filtered_df.astype(object).where(filtered_df.notnull(), None)
        
        return filtered_df
    except FileNotFoundError:
        print("Arquivo 'feedbacks.xlsx' não encontrado.")
        return None

# Rota para adicionar clientes à carteira de cliente
@app.route('/add_to_client_portfolio', methods=['POST'])
def add_to_client_portfolio():
    selected_client = request.form.get('selected_client')
    if selected_client:
        try:
            # Lê os dados do arquivo Excel filtrados para o usuário logado
            logged_username = request.form.get('logged_user')
            feedbacks_df = read_feedbacks(logged_username)
            if feedbacks_df is None:
                return "Falha ao ler os dados do arquivo."
            
            # Define o caminho do arquivo Excel
            current_date = pd.Timestamp.now().strftime("%Y-%m-%d")
            directory = 'CLIENT_PORTFOLIO_FOLDER'
            if not os.path.exists(directory):
                os.makedirs(directory)
            filepath = os.path.join(directory, f'{logged_username}_{current_date}_client_portfolio.xlsx')
            
            # Cria um DataFrame com os dados do cliente selecionado
            selected_client_data = selected_client.split('\n')
            df = pd.DataFrame([selected_client_data[:len(feedbacks_df.columns)]], columns=feedbacks_df.columns)
            
            # Salva o DataFrame como arquivo Excel
            df.to_excel(filepath, index=False)
            
            return f'Cliente adicionado à carteira de clientes com sucesso e gravado em {filepath}.'
        except Exception as e:
            return f'Erro ao adicionar cliente à carteira de clientes: {str(e)}'
    else:
        return 'Nenhum cliente selecionado.'



def start_rail_trail_logic(data):
    try:
        # Calcular quantidade de clientes falados
        total_clientes_falados = data['nomeCliente'].nunique()
        
        # Calcular total de portas batidas
        total_portas_batidas = len(data)
        
        # Calcular percentagens de clientes por fornecedor de energia
        percentagens_fornecedores = data['fornecedorEnergia'].value_counts(normalize=True) * 100
        
        # Calcular valor médio das faturas de energia por fornecedor
        valores_medios_faturas = data.groupby('fornecedorEnergia')['valorFaturaEnergia'].mean()
        
        # Calcular períodos horários de sucesso
        data['Hora'] = pd.to_datetime(data['Data e Hora']).dt.hour
        periodos_horarios_sucesso = data.groupby('Hora').size().idxmax()
        
        # Resultados das análises
        analysis_results = {
            'total_clientes_falados': total_clientes_falados,
            'total_portas_batidas': total_portas_batidas,
            'percentagens_fornecedores': percentagens_fornecedores.to_dict(),
            'valores_medios_faturas': valores_medios_faturas.to_dict(),
            'periodos_horarios_sucesso': periodos_horarios_sucesso
        }
        
        # Retornar os resultados da análise
        return analysis_results
    except Exception as e:
        return {'error': str(e)}
    

@app.route('/start_rail_trail', methods=['POST'])
def start_rail_trail():
    try:
        # Obter os dados da tabela enviados na requisição
        data = request.get_json()
        
        # Chamar a função para iniciar o Rail Trail
        analysis_results = start_rail_trail_logic(pd.DataFrame(data))
        
        # Retornar os resultados da análise
        return jsonify(analysis_results)
    except Exception as e:
        return jsonify({'error': str(e)})


# Rota para finalizar o dia
@app.route('/end_of_day', methods=['POST'])
def end_of_day():
    response = end_of_day_logic()
    return jsonify(response)


@app.route('/add_marker', methods=['POST'])
def add_marker():
    cliente = request.form['cliente']
    info = request.form['info']
    data = request.form['data']
    user = request.form['user']
    latitude = request.form['latitude']
    longitude = request.form['longitude']

    # Salvar os dados em um arquivo XLSX
    salvar_em_xlsx(cliente, info, data, user, latitude, longitude)

    # Redirecionar de volta para a página de territórios com uma mensagem de sucesso
    return redirect(url_for('territorios', mensagem='Marcação feita com sucesso.'))

# Função para salvar os dados em um arquivo XLSX




def salvar_em_xlsx(cliente, info, data, user, latitude, longitude):
    arquivo = 'marcações.xlsx'

    # Verificar se o arquivo já existe
    try:
        # Ler o arquivo existente
        df = pd.read_excel(arquivo)
        
        # Adicionar os novos dados na próxima linha disponível
        linha = df.shape[0]
        df.loc[linha] = [user, cliente, info, data, latitude, longitude]

        # Sobrescrever o arquivo existente
        df.to_excel(arquivo, index=False)

    except FileNotFoundError:
        # Se o arquivo não existir, criar um novo com os dados
        df_novos_dados = pd.DataFrame({
            'User': [user],
            'Nome Cliente': [cliente],
            '+ info': [info],
            'Data Hora Marcação Visita': [data],
            'Latitude': [latitude],
            'Longitude': [longitude]
        })
        df_novos_dados.to_excel(arquivo, index=False)





# Rota para a página de territórios
@app.route('/territorios')
def territorios():
    mensagem = request.args.get('mensagem', '')
    return render_template('territorios.html', mensagem=mensagem)


# Função para consultar as marcações no arquivo XLSX
def consultar_marcacoes():
    try:
        # Ler o arquivo Excel com as marcações
        df = pd.read_excel('marcações.xlsx')
        
        # Converter os dados para o formato JSON
        marcacoes = df.to_dict(orient='records')
        
        return marcacoes
    except FileNotFoundError:
        # Se o arquivo não existir, retornar uma lista vazia
        return []

@app.route('/consultar_marcacoes')
def consultar_marcacoes_route():
    # Chamar a função para consultar as marcações
    marcacoes = consultar_marcacoes()
    
    # Retornar os dados no formato JSON
    return jsonify(marcacoes)