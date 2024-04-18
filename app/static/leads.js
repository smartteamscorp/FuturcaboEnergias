// scripts.js

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

