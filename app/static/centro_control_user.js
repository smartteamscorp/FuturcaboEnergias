// Script JavaScript para carregar os usuários da lista e atribuir Roles
$(document).ready(function() {
    const tbody = $('#usuarios-corpo');

    // Função para atribuir Role ao usuário
    function assignRole(username, email, role) {
        // Enviar os dados para a rota /assign_role no backend
        $.ajax({
            url: '/assign_role',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username: username, email: email, role: role }),
            success: function(response) {
                console.log(response.message); // Exibir mensagem de sucesso no console
            },
            error: function(error) {
                console.error('Erro ao atribuir Role:', error);
            }
        });
    }

    // Função para criar a linha de tabela para cada usuário
    function createUserRow(user) {
        const tr = $('<tr>');
        tr.html(`
            <td>${user.Username}</td>
            <td>${user.Email}</td>
            <td>${user.Função}</td>
            <td>
                <select class="role-selector">
                    <option value="" disabled selected>Selecione o Role</option>
                    <option value="BackOffice">BackOffice</option>
                    <option value="GestorEquipa">GestorEquipa</option>
                    <option value="GestorComercial">GestorComercial</option>
                    <option value="ParceiroAgente">Parceiro/Agente</option>
                    <option value="GestorOperacional">GestorOperacional</option>
                    <option value="Admin">Admin</option>
                </select>
            </td>
        `);
        tr.find('.role-selector').change(function() {
            const selectedRole = $(this).val();
            assignRole(user.Username, user.Email, selectedRole);
        });
        return tr;
    }

    // Carregar os usuários e adicionar à tabela
    $.get('/get_users', function(data) {
        data.forEach(user => {
            tbody.append(createUserRow(user));
        });
    }).fail(function(error) {
        console.error('Erro ao carregar usuários:', error);
    });
});

// Script JavaScript para gravar as alterações quando o botão 'Gravar Alterações' é clicado
$('#gravar-dados').click(function() {
    // Enviar uma solicitação POST para a rota /save_changes no backend
    $.post('/save_changes', function(response) {
        console.log(response.message); // Exibir mensagem de sucesso no console
    }).fail(function(error) {
        console.error('Erro ao gravar alterações:', error);
    });
});
