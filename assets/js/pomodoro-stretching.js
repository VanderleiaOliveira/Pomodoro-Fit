// essa função vai ser chamada quando o botão de configuração do pomodoro for clicado
// ou quando o localStorage não tiver valor
// ela altera a visibilidade do form de configuração do pomodoro
// alternando (toogle) entre mostrar(block) e esconder(none) na classe .hidden-config
// inicialmente .hidden-config está com display: none
function togglePomodoroConfig() {
  const hiddenDiv = document.getElementById('conteudoOculto');
  hiddenDiv.classList.toggle('hidden-config');
}

// depois de carregar todo o DOM, essa função olha os valores do localStorage
// se as configurações do pomodoro estiverem presentes, preenche os campos do
//formulario de configuração do pomodoro, agora casos contrários, abre as configurações
// e alerta o usuário para preencher as configurações
document.addEventListener('DOMContentLoaded', function () {
  // Verifica se os valores estão presentes no localStorage
  const username = localStorage.getItem('username');
  const pomodoroDuration = localStorage.getItem('pomodoroDuration');
  const difficulty = localStorage.getItem('difficulty');

  // Se algum valor estiver ausente, abre as configurações
  if (!username || !pomodoroDuration || !difficulty) {
    togglePomodoroConfig();
    alert(
      'Por favor, infome as configurações do pomodoro conforme sua preferencia.'
    );
  } else {
    // Se os valores estiverem presentes, preenche os campos
    document.getElementById('username').value = username;
    document.getElementById('pomodoroDuration').value = pomodoroDuration;
    document.getElementById('difficulty').value = difficulty;
  }
});

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

let countdownInterval;
let timeLeftInSeconds;

function startPomodoro() {
  const durationMinutes = localStorage.getItem('pomodoroDuration') || 25; // Fallback para 25 minutos
  timeLeftInSeconds = durationMinutes * 60;
  updateCountdownDisplay();

  countdownInterval = setInterval(() => {
    timeLeftInSeconds -= 1;
    updateCountdownDisplay();

    if (timeLeftInSeconds <= 0) {
      clearInterval(countdownInterval);
      // Chama a função para exibir um alongamento ao final do Pomodoro
      showStretching()
        .then(() => {
          console.log('Alongamento exibido.');
        })
        .catch((error) => {
          console.error('Erro ao tentar exibir o alongamento: ', error);
        });
    }
  }, 1000);
}

function pausePomodoro() {
  clearInterval(countdownInterval);
}

function continuePomodoro() {
  countdownInterval = setInterval(() => {
    timeLeftInSeconds -= 1;
    updateCountdownDisplay();

    if (timeLeftInSeconds <= 0) {
      clearInterval(countdownInterval);
      // Chama a função para exibir um alongamento ao final do Pomodoro
      showStretching()
        .then(() => {
          console.log('Alongamento exibido.');
        })
        .catch((error) => {
          console.error('Erro ao tentar exibir o alongamento: ', error);
        });
    }
  }, 1000);
}

function resetPomodoro() {
  clearInterval(countdownInterval);
  startPomodoro();
}

function updateCountdownDisplay() {
  const minutes = Math.floor(timeLeftInSeconds / 60);
  const seconds = timeLeftInSeconds % 60;
  document.getElementById('pomodoroCountdown').textContent = `${String(
    minutes
  ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// carregar os alongamentos para usar conforme as configurações do usuário
async function loadStretchings() {
  const response = await fetch('./assets/json/stretching.json');
  const stretchings = await response.json();
  return stretchings;
}

// exibir os alongamentos ao término do pomodoro
async function showStretching() {
  const difficulty = localStorage.getItem('difficulty');
  const stretchings = await loadStretchings();
  const previousStretchings = JSON.parse(
    localStorage.getItem('previousStretchings') || '[]'
  );

  // Filtra os alongamentos pela dificuldade e que não foram mostrados recentemente
  const availableStretchings = stretchings.filter(
    (stretching) =>
      stretching.difficulty === difficulty &&
      !previousStretchings.includes(stretching.id)
  );

  // Seleciona um alongamento aleatoriamente
  const stretchingToShow =
    availableStretchings[
      Math.floor(Math.random() * availableStretchings.length)
    ];

  // Atualiza o local que será exibido o alongamento e a imagem
  if (stretchingToShow) {
    document.getElementById('stretchingName').textContent =
      'Nome:\n' + stretchingToShow.name;
    document.getElementById('stretchingEquipment').textContent =
      'Equipamento:\n' + stretchingToShow.equipment;
    document.getElementById('stretchingMuscle').textContent =
      'Músculo:\n' + stretchingToShow.muscle;
    document.getElementById('stretchingInstructions').textContent =
      'Instruções:\n' + stretchingToShow.instructions;
    document.getElementById('stretchingText').style.display = 'block';
    document.getElementById('stretchingImage').textContent =
      'IMAGEM ALONGAMENTO'; // Atualize isso conforme necessário
    document.getElementById('stretchingImage').style.display = 'block';

    // Salva o ID do alongamento mostrado para não repetir
    previousStretchings.push(stretchingToShow.id);
    localStorage.setItem(
      'previousStretchings',
      JSON.stringify(previousStretchings)
    );
  }
}

function stretchingDone() {
  document.getElementById('stretchingText').style.display = 'none';
  document.getElementById('stretchingImage').style.display = 'none';

  // Limpa o conteúdo (opcional)
  document.getElementById('stretchingName').textContent = '';
  document.getElementById('stretchingEquipment').textContent = '';
  document.getElementById('stretchingMuscle').textContent = '';
  document.getElementById('stretchingInstructions').textContent = '';

  // Incrementa o total de alongamentos feitos
  const totalStretchingDone =
    parseInt(localStorage.getItem('totalStretchingDone') || '0') + 1;
  localStorage.setItem('totalStretchingDone', totalStretchingDone.toString());
}
