// Função para enviar a lead selecionada para o comercial
// Função para enviar a lead selecionada para o servidor
function enviarLead() {
    // Obtém os valores selecionados pelo usuário
    var leadId = document.getElementById("lead").value;
    var leadType = document.getElementById("lead-type").value;
    var comercial = document.getElementById("comercial").value;
    var observacao = document.getElementById("observacao").value;

    // Cria um objeto com os dados da lead
    var leadData = {
        leadId: leadId,
        leadType: leadType,
        comercial: comercial,
        observacao: observacao
    };

    // Envia os dados para o servidor
    fetch('/enviar_lead', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadData)
    })
    .then(response => {
        if (response.ok) {
            // Se a resposta for bem-sucedida, exibe uma mensagem de sucesso
            alert('Lead enviada com sucesso!');
        } else {
            // Se houver algum problema, exibe uma mensagem de erro
            alert('Erro ao enviar a lead. Por favor, tente novamente.');
        }
    })
    .catch(error => {
        // Em caso de erro na requisição, exibe uma mensagem de erro
        console.error('Erro:', error);
        alert('Ocorreu um erro ao enviar a lead. Por favor, tente novamente.');
    });
}


// Função para fechar a página de gestão de leads e voltar à página anterior
function fecharPagina() {
    window.location.href = '/leads';
}

