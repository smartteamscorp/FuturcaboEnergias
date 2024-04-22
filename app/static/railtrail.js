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

function openRailTrail() {
    // Redirecionar para a página rail_trail_open.html
    window.location.href = "rail_trail_results.html";
}
