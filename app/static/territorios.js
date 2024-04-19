// Função para detectar o usuário logado
function detectarUsuarioLogado() {
    // Aqui você pode adicionar o código para verificar se o usuário está logado
    // Por exemplo, verificar se há um token de autenticação armazenado
    // Se o usuário estiver logado, retorne true, caso contrário, retorne false
    // Neste exemplo, vamos assumir que o usuário está sempre logado para simplificar
    return true;
}

// Função para inicializar o mapa// Função para inicializar o mapa
function initMap() {
    // Inicializa o mapa
    var map = L.map('map').setView([39.3999, -8.2245], 6); // Coordenadas de Portugal

    // Adiciona camada do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Função para adicionar marcador com popup de formulário
    function addMarker(e) {
        var popupContent = `
            <form id="popup-form" action="/add_marker" method="post">
                <label for="cliente">Nome do Cliente:</label><br>
                <input type="text" id="cliente" name="cliente" required><br>
                <label for="info">Informação Adicional:</label><br>
                <textarea id="info" name="info"></textarea><br>
                <label for="data">Data e Hora da Visita:</label><br>
                <input type="datetime-local" id="data" name="data" required><br>
                <label for="user">User:</label><br>
                <input type="text" id="user" name="user" required><br>
                <!-- Adicionar campos ocultos para as coordenadas -->
                <input type="hidden" id="latitude" name="latitude">
                <input type="hidden" id="longitude" name="longitude">
                <button type="submit">Adicionar Marcação</button>
            </form>
        `;

        var popup = L.popup().setLatLng(e.latlng).setContent(popupContent).openOn(map);

        // Preencher campos de coordenadas ocultos com os valores clicados no mapa
        document.getElementById('latitude').value = e.latlng.lat;
        document.getElementById('longitude').value = e.latlng.lng;

        // Submeter o formulário
        document.getElementById('popup-form').addEventListener('submit', function(event) {
            event.preventDefault();

            var cliente = document.getElementById('cliente').value;
            var info = document.getElementById('info').value;
            var data = document.getElementById('data').value;
            var user = document.getElementById('user').value;

            // Enviar os dados do formulário
            fetch('/add_marker', {
                method: 'POST',
                body: new FormData(document.getElementById('popup-form')),
            })
            .then(response => {
                if (response.ok) {
                    // Limpar os campos do formulário após o envio bem-sucedido
                    document.getElementById('cliente').value = '';
                    document.getElementById('info').value = '';
                    document.getElementById('data').value = '';
                    document.getElementById('user').value = '';

                    // Exibir mensagem de sucesso
                    alert('Marcação feita com sucesso.');
                    popup.remove(); // Remover o popup após o sucesso
                } else {
                    // Exibir mensagem de erro
                    alert('Erro ao adicionar marcação. Por favor, tente novamente.');
                }
            })
            .catch(error => {
                console.error('Erro ao enviar dados do formulário:', error);
                // Exibir mensagem de erro
                alert('Erro ao adicionar marcação. Por favor, tente novamente.');
            });
        });
    }

    // Adiciona evento de clique no mapa para adicionar marcador
    map.on('click', addMarker);
}

// Inicializa o mapa quando a página é carregada
window.onload = function() {
    initMap();
};


var messageContainer = document.getElementById('message-container');
messageContainer.innerHTML = "<p>Bem-vindo! Para marcar uma visita, clique no mapa para selecionar a localização desejada. Preencha as informações do cliente, a data e hora da visita e o seu User. Depois, clique em 'Adicionar Marcação' , para adicionar á sua agenda.</p>";

