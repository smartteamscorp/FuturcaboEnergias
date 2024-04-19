function confirmClient() {
    document.getElementById("addClientForm").submit();
}
function cancel() {
    document.getElementById("confirmationModal").style.display = "none";
}
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const row = this.closest('tr');
        const cells = row.querySelectorAll('td');
        let clientDetails = "Vai adicionar o cliente:\n";
        cells.forEach(cell => {
            clientDetails += cell.textContent.trim() + "\n";
        });
        document.getElementById("selectedClient").value = clientDetails;
        document.getElementById("confirmationMessage").textContent = clientDetails;
        document.getElementById("confirmationModal").style.display = "block";
    });
});


// Função para calcular os resultados da análise
function calculateAnalysisResults() {
    // Obter os dados da tabela dinâmica
    var tableRows = document.querySelectorAll('#usuarios-corpo tr');

    // Total de clientes falados
    var totalClientesFalados = tableRows.length;

    // Total de portas batidas (quantidade de linhas na tabela)
    var totalPortasBatidas = tableRows.length;

    // Inicializar contadores para cálculos
    var fornecedoresEnergia = {};
    var totalValoresFaturas = {};
    var totalClientesPorFornecedor = {};

    // Iterar sobre cada linha da tabela para calcular valores
    tableRows.forEach(function(row) {
        // Obter valores da linha
        var fornecedor = row.querySelector('td:nth-child(3)').innerText;
        var valorFatura = parseFloat(row.querySelector('td:nth-child(4)').innerText.replace('€', ''));

        // Contabilizar fornecedores de energia
        fornecedoresEnergia[fornecedor] = (fornecedoresEnergia[fornecedor] || 0) + 1;

        // Contabilizar valores das faturas por fornecedor
        totalValoresFaturas[fornecedor] = (totalValoresFaturas[fornecedor] || 0) + valorFatura;

        // Contabilizar clientes por fornecedor
        totalClientesPorFornecedor[fornecedor] = (totalClientesPorFornecedor[fornecedor] || 0) + 1;
    });

    // Calcular percentagens de clientes por fornecedor
    var percentagensFornecedores = {};
    Object.keys(totalClientesPorFornecedor).forEach(function(fornecedor) {
        var percentagem = (totalClientesPorFornecedor[fornecedor] / totalClientesFalados) * 100;
        percentagensFornecedores[fornecedor] = percentagem.toFixed(2) + '%';
    });

    // Calcular valores médios das faturas de energia por fornecedor
    var valoresMediosFaturas = {};
    Object.keys(totalValoresFaturas).forEach(function(fornecedor) {
        var valorMedio = totalValoresFaturas[fornecedor] / totalClientesPorFornecedor[fornecedor];
        valoresMediosFaturas[fornecedor] = '€' + valorMedio.toFixed(2);
    });

    // Calcular o período horário de sucesso
    var periodoHorarioSucesso = '09:00 - 12:00';

    // Exibir os resultados da análise
    document.getElementById('analysisResults').style.display = 'block';
    document.getElementById('totalClientesFalados').innerText = totalClientesFalados;
    document.getElementById('totalPortasBatidas').innerText = totalPortasBatidas;
    document.getElementById('percentagensFornecedores').innerHTML = '';
    Object.keys(percentagensFornecedores).forEach(function(fornecedor) {
        var li = document.createElement('li');
        li.innerText = fornecedor + ': ' + percentagensFornecedores[fornecedor];
        document.getElementById('percentagensFornecedores').appendChild(li);
    });
    document.getElementById('valoresMediosFaturas').innerHTML = '';
    Object.keys(valoresMediosFaturas).forEach(function(fornecedor) {
        var li = document.createElement('li');
        li.innerText = fornecedor + ': ' + valoresMediosFaturas[fornecedor];
        document.getElementById('valoresMediosFaturas').appendChild(li);
    });
    document.getElementById('periodoHorarioSucesso').innerText = periodoHorarioSucesso;
}
