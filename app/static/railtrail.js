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





function startRailTrail() {
    // Extrair os dados da tabela
    var tableRows = document.querySelectorAll('tbody tr');
    var data = [];
    tableRows.forEach(function(row) {
        var rowData = {};
        var cells = row.querySelectorAll('td');
        cells.forEach(function(cell, index) {
            var columnName = document.querySelector(`thead th:nth-child(${index + 1})`).textContent;
            var cellContent = cell.textContent.trim(); // Remover espaços em branco em excesso
            console.log('Valor da célula:', cellContent.toString());
            if (!cellContent) {
                cellContent = null; // Converter células vazias para null
            } else if (!isNaN(cellContent)) {
                cellContent = parseFloat(cellContent); // Converter para número se possível
            } else if (cellContent === "nan") {
                cellContent = null; // Converter "nan" para null
            }
            rowData[columnName] = cellContent;
        });
        data.push(rowData);
    });

    // Enviar os dados para o servidor
    if (data.length > 0) {
        fetch('/start_rail_trail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            // Manipular os resultados da análise conforme necessário
            console.log(data);
        })
        .catch(error => console.error('Erro ao iniciar Rail Trail:', error));
    } else {
        console.log('Nenhum dado válido para enviar');
    }
}
