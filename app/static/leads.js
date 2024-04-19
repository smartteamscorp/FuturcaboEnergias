// Função para mostrar e ocultar as secções com base no clique no menu de navegação
function toggleSection(sectionId) {
    // Esconder todas as secções
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Mostrar a secção correspondente ao ID fornecido
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    }
}

// Adicionar gestores de eventos para os cliques nos links de navegação
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.nav-menu a');
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            const sectionId = event.target.getAttribute('href').substring(1);
            toggleSection(sectionId);
        });
    });
});

// Função para enviar o formulário de inserção de lead para o servidor
function inserirLead(section) {
    var form = document.querySelector('#' + section + ' form');
    var formData = new FormData(form);
    
    fetch('/submit_lead', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert('Lead inserida com sucesso!');
            form.reset();
        } else {
            alert('Ocorreu um erro ao inserir a lead. Por favor, tente novamente.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

// Função para consultar leads no backoffice
function consultarLeads() {
    fetch('/consultar_leads')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao consultar as leads');
        }
        return response.json();
    })
    .then(data => {
        // Verifica se os dados são um objeto JSON válido
        if (typeof data === 'object' && data !== null) {
            abrirModal(data);
        } else {
            throw new Error('Dados da lead inválidos');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao consultar as leads. Por favor, tente novamente.');
    });
}


// Função para abrir o modal e exibir os dados da lead
function abrirModal(data) {
    var modal = document.getElementById("leadModal");
    var modalContent = document.getElementById("leadData");

    // Limpa o conteúdo anterior do modal
    modalContent.innerHTML = "";

    // Cria uma tabela para exibir os dados da lead
    var table = document.createElement("table");
    table.classList.add("lead-table");

    // Cria o cabeçalho da tabela
    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    for (var key in data[0]) {
        var headerCell = document.createElement("th");
        headerCell.textContent = key;
        headerRow.appendChild(headerCell);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Cria o corpo da tabela com os dados das leads
    var tbody = document.createElement("tbody");
    data.forEach(function(lead) {
        var row = document.createElement("tr");
        for (var key in lead) {
            var cell = document.createElement("td");
            cell.textContent = lead[key];
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Adiciona a tabela ao conteúdo do modal
    modalContent.appendChild(table);

    // Adiciona botões para iniciar o processo de entrega ou finalização da lead
    var buttonRow = document.createElement("div");
    buttonRow.classList.add("modal-buttons");
    data.forEach(function(lead) {
        var button = document.createElement("button");
        button.textContent = "Iniciar Processo";
        button.addEventListener("click", function() {
            if (lead.lead_type === "comercializacao") {
                entregarLead(lead);
            } else if (lead.lead_type === "finalizada") {
                finalizarLead(lead);
            }
        });
        buttonRow.appendChild(button);
    });
    modalContent.appendChild(buttonRow);

    // Exibe o modal
    modal.style.display = "block";
}

// Função para fechar o modal
function fecharModal() {
    var modal = document.getElementById("leadModal");
    modal.style.display = "none";
}

