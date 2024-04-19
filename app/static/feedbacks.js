// Função para obter o usuário logado
function getUserLogado() {
    return fetch('/get_logged_user')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao obter usuário logado');
            }
            return response.text();  // Retorna o nome de usuário como texto
        })
        .catch(error => {
            console.error(error.message);
            return "Convidado";  // Retorna "Convidado" em caso de erro
        });
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('/get_uploaded_files')
        .then(response => response.json())
        .then(files => {
            const selectElement = document.getElementById('cellSelect');
            files.forEach(file => {
                const option = document.createElement('option');
                option.value = file;
                option.textContent = file;
                selectElement.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao obter arquivos:', error));
});

function loadCellData() {
    var selectedCell = document.getElementById("cellSelect").value;
    // Enviar solicitação para obter os dados da célula selecionada do servidor
    fetch(`/get_dados/${selectedCell}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar dados da célula');
            }
            return response.json();
        })
        .then(data => {
            var moradaSelect = document.getElementById("moradaSelect");
            // Limpar o conteúdo anterior
            moradaSelect.innerHTML = "";
            
            var moradasUnicas = new Set();
            data.forEach(celula => {
                moradasUnicas.add(celula['Morada']);
            });
            // Preencher o seletor de morada com as moradas únicas
            moradasUnicas.forEach(morada => {
                var option = document.createElement("option");
                option.text = morada;
                moradaSelect.add(option);
            });
            // Mostrar o seletor de morada após carregar os dados
            var moradaContainer = document.getElementById("moradaContainer");
            moradaContainer.style.display = "block";
        })
        .catch(error => console.error(error.message));
}

function loadNumeroData() {
    var selectedMorada = document.getElementById("moradaSelect").value;
    var selectedCell = document.getElementById("cellSelect").value;
    // Enviar solicitação para obter os números correspondentes à morada selecionada do servidor
    fetch(`/get_numeros/${encodeURIComponent(selectedMorada)}/${selectedCell}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao obter números');
            }
            return response.json();
        })
        .then(numeros => {
            var numeroList = document.getElementById("numeroList");
            // Limpar o conteúdo anterior
            numeroList.innerHTML = "";
            // Adicionar os números correspondentes como itens de lista
            numeros.forEach(numero => {
                var listItem = document.createElement("li");
                listItem.textContent = numero;
                // Adiciona um evento de clique ao número para exibir o questionário de contato
                listItem.addEventListener('click', function() {
                    var numeroSelecionado = numero;
                    document.getElementById("numeroSelecionadoDisplay").textContent = numeroSelecionado;
                    showQuestionarioContato(numeroSelecionado);
                });
                numeroList.appendChild(listItem);
            });
            // Mostrar a lista de números após carregar os dados
            var numeroContainer = document.getElementById("numeroContainer");
            numeroContainer.style.display = "block";
        })
        .catch(error => console.error(error.message));
}


// Função para exibir o questionário de contato
function showQuestionarioContato(numero, coordenadas) {
    var andarContainer = document.getElementById("andarContainer");
    andarContainer.style.display = "block";
    var questionarioContato = document.getElementById("questionarioContato");
    // Define o conteúdo do questionário de contato
    questionarioContato.style.display = "block";
    // Define o número selecionado na caixa de exibição
    document.getElementById("numeroSelecionadoDisplay").textContent = numero;
    // Define o número selecionado no campo oculto
    document.getElementById("numeroSelecionado").value = numero;
    // Exibir as coordenadas correspondentes ao número selecionado
    document.getElementById("coordenadas").textContent = coordenadas;
    // Exibir o menu de botões
    var menuContato = document.getElementById("menuContato");
    menuContato.style.display = "block";
    // Rolar a página até o questionário de contato
    questionarioContato.scrollIntoView({ behavior: "smooth" });
}


function opcaoSelecionada(marcaOpcao) {
    // Atualizar a marcação na div oculta
    document.getElementById("marcaOpcao").textContent = opcao;
}

// Função para enviar a mensagem do questionário de contato
function enviarFeedback(marcaOpcao) {
    // Obter os valores dos campos do formulário
    var nomeCliente = document.getElementById("nomeInput").value;
    var fornecedorEnergia = document.getElementById("fornecedorEnergiaInput").value;
    var valorFaturaEnergia = document.getElementById("faturaEnergiaInput").value;
    var tipoGas = document.getElementById("tipoGasInput").value;
    var fornecedorGas = document.getElementById("fornecedorGasInput").value;
    var valorFaturaGas = document.getElementById("faturaGasInput").value;
    var infoAdicional = document.getElementById("infoInput").value;
    var contatoCliente = document.getElementById("contatoInput").value;
    var celulaSelecionada = document.getElementById("cellSelect").value;
    var moradaSelecionada = document.getElementById("moradaSelect").value;
    var numeroSelecionado = document.getElementById("numeroSelecionado").value;
    var coordenadas = document.getElementById("coordenadas").textContent; // Obter as coordenadas do elemento HTML
    var marcaOpcao = document.getElementById("marcaOpcao").textContent; // Obter a marcação do botão

    // Obter a data e hora atual
    var dataHoraAtual = new Date().toISOString();

    // Obter o usuário logado, ou definir como "Convidado" se não houver usuário logado
    var userLogado = getUserLogado() || "Convidado";

    // Enviar os dados para o servidor usando fetch API
    fetch('/enviar_feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nomeCliente: nomeCliente,
            fornecedorEnergia: fornecedorEnergia,
            valorFaturaEnergia: valorFaturaEnergia,
            tipoGas: tipoGas,
            fornecedorGas: fornecedorGas,
            valorFaturaGas: valorFaturaGas,
            infoAdicional: infoAdicional,
            contatoCliente: contatoCliente,
            celulaSelecionada: celulaSelecionada,
            moradaSelecionada: moradaSelecionada,
            numeroSelecionado: numeroSelecionado,
            coordenadas: coordenadas,
            stats: marcaOpcao, // Incluir a marcação do botão
            user: userLogado // Usuário logado
        })
    })
    .then(response => {
        if (response.ok) {
            console.log('Feedback enviado com sucesso!');
            // Limpar os campos do formulário após o envio bem-sucedido
            document.getElementById("nomeInput").value = "";
            document.getElementById("fornecedorEnergiaInput").value = "";
            document.getElementById("faturaEnergiaInput").value = "";
            document.getElementById("tipoGasInput").value = "";
            document.getElementById("fornecedorGasInput").value = "";
            document.getElementById("faturaGasInput").value = "";
            document.getElementById("infoInput").value = "";
            document.getElementById("contatoInput").value = "";
            // Limpar a caixa de exibição do número selecionado
            document.getElementById("numeroSelecionadoDisplay").textContent = "";
            numeroContainer.scrollIntoView({ behavior: "smooth" });
        } else {
            console.error('Erro ao enviar feedback.');
        }
    })
    .catch(error => console.error('Erro ao enviar feedback:', error));

}

// Função para lidar com o clique no botão "N/A Não Abre/Não Responde"
function marcarNaoAbreNaoResponde() {
    marcaOpcao('N/A Não Abre/Não Responde');
}

// Função para lidar com o clique no botão "Marcar Visita"
function marcarVisita() {
    marcaOpcao('Marcar Visita');
}

// Função para lidar com o clique no botão "Marcar Oportunidade"
function marcarOportunidade() {
    marcaOpcao('Marcar Oportunidade');
}

// Função para lidar com o clique no botão "Fecho"
function fechar() {
    marcaOpcao('Fecho');
}

