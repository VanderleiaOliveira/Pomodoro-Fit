// essa função vai ser chamada quando o botão de configuração do pomodoro for clicado
// ou quando o localStorage não tiver valor
// ela altera a visibilidade do form de configuração do pomodoro
// alternando (toogle) entre mostrar(block) e esconder(none) na classe .hidden-config
// inicialmente .hidden-config está com display: none

// depois de carregar todo o DOM, essa função olha os valores do localStorage
// se as configurações do pomodoro estiverem presentes, preenche os campos do
//formulario de configuração do pomodoro, agora casos contrários, abre as configurações
// e alerta o usuário para preencher as configurações

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('configPomodoro');

  // Adiciona um ouvinte de evento para o envio do formulário
  form.addEventListener('submit', function (event) {
    // Previne o comportamento padrão do formulário (recarregar a página)
    event.preventDefault();

    // Obtém os valores dos inputs
    const username = document.getElementById('username').value;
    const pomodoroDuration = document.getElementById('pomodoroDuration').value;
    const difficulty = document.getElementById('difficulty').value;

    // Salva os valores no localStorage
    localStorage.setItem('username', username);
    localStorage.setItem('pomodoroDuration', pomodoroDuration);
    localStorage.setItem('difficulty', difficulty);

    // Chama a função para ocultar as configurações do Pomodoro
    togglePomodoroConfig();
  });
});

// TESTE
// para ver se as informacoes foram salvas corretamente ou existem no localStorage:
console.log('Username: ', localStorage.getItem('username'));
console.log('Pomodoro Duration: ', localStorage.getItem('pomodoroDuration'));
console.log('Difficulty: ', localStorage.getItem('difficulty'));
