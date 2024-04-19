const links = document.querySelectorAll('.nav__link');
const light = document.querySelector('.nav__light');
const contents = document.querySelectorAll('.content');

function moveLight({offsetLeft, offsetWidth}){
  light.style.left = `${offsetLeft - offsetWidth/4}px`;
}

function activeLink(linkActive){
  links.forEach(link => {
    link.classList.remove('active');
    linkActive.classList.add('active');
  });
}

links.forEach((link, index) => {
  link.addEventListener('click', (event) =>
  {
        moveLight(event.target);
        activeLink(link);
        showContent(index); // Ativa o conteúdo correspondente ao índice do link clicado
    });
});

document.addEventListener('DOMContentLoaded', function() {
    links.forEach((link, index) => {
        link.addEventListener('click', function() {
            const label = this.dataset.label;
            showNotification(label);
            setTimeout(() => hideNotification(), 3000);
            showContent(index); // Ativa o conteúdo correspondente ao índice do link clicado
        });
    });
});

function showNotification(label) {
    const labelSpan = document.querySelector('.notification .label');
    labelSpan.textContent = label;
    notification.classList.add('show');
}

function hideNotification() {
    notification.classList.remove('show');
}

function showContent(index) {
    contents.forEach((content, i) => {
        if (i === index) {
            content.classList.add('active'); // Ativa o conteúdo correspondente ao índice fornecido
        } else {
            content.classList.remove('active'); // Desativa outros conteúdos
        }
    });
}


document.addEventListener('DOMContentLoaded', function() {
    const modalFazerMarcacao = document.getElementById('modalFazerMarcacao');
    const modalConsultarMarcacoes = document.getElementById('modalConsultarMarcacoes');
    const btnFazerMarcacao = document.getElementById('btnFazerMarcacao');
    const btnConsultarMarcacoes = document.getElementById('btnConsultarMarcacoes');
    const closeButtons = document.getElementsByClassName('close');

    // Função para abrir o modal
    function openModal(modal) {
        modal.style.display = 'block';
    }

    // Função para fechar o modal
    function closeModal(modal) {
        modal.style.display = 'none';
    }

    // Event listeners para abrir os modais
    btnFazerMarcacao.addEventListener('click', () => openModal(modalFazerMarcacao));
    btnConsultarMarcacoes.addEventListener('click', () => openModal(modalConsultarMarcacoes));

    // Event listeners para fechar os modais
    for (let i = 0; i < closeButtons.length; i++) {
        closeButtons[i].addEventListener('click', () => {
            closeModal(modalFazerMarcacao);
            closeModal(modalConsultarMarcacoes);
        });
    }

    // Inicialização dos mapas (Leaflet)
    const mapFazerMarcacao = L.map('mapFazerMarcacao').setView([0, 0], 13);
    const mapConsultarMarcacoes = L.map('mapConsultarMarcacoes').setView([0, 0], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapFazerMarcacao);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapConsultarMarcacoes);
});
var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    .openPopup();

    document.addEventListener('DOMContentLoaded', function() {
    links.forEach((link, index) => {
        link.addEventListener('click', function() {
            const label = this.dataset.label;
            showNotification(label);
            setTimeout(() => hideNotification(), 3000);
            showContent(index); // Ativa o conteúdo correspondente ao índice do link clicado
            
            // Adiciona ou remove a classe 'active' para exibir ou ocultar o conteúdo da carteira
            if (index === 1) { // Se o botão da carteira foi selecionado
                document.getElementById('content-carteira').classList.add('active');
            } else {
                document.getElementById('content-carteira').classList.remove('active');
            }
        });
    });
});


    $(document).ready(function() {
        // Fazer uma requisição AJAX para obter o arquivo PDF
        $.ajax({
            url: "/static/Resumo da Oferta Comercial_Março_Tudo a Dobrar_ 2x_Velocidade_.pdf",
            type: 'GET',
            xhrFields: {
                responseType: 'blob'
            },
            success: function(data) {
                var file = new Blob([data], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(file);
                $('#pdf-embed').attr('src', fileURL);
            },
            error: function(xhr, status, error) {
                console.error('Erro ao carregar o arquivo PDF:', error);
            }
        });
    });
