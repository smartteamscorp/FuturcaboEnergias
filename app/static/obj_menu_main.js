// Função para exibir ou ocultar as opções do menu
function toggleMenuOptions() {
    var menuOptions = document.getElementById("menu-options");
    if (menuOptions.style.display === "none") {
        menuOptions.style.display = "block";
    } else {
        menuOptions.style.display = "none";
    }
}

// Adicionar um event listener para o clique no botão do menu
document.addEventListener("DOMContentLoaded", function() {
    var menuButton = document.getElementById("menu-button");
    menuButton.addEventListener("click", toggleMenuOptions);
});
