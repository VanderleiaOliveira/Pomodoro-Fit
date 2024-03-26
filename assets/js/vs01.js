let button = document.getElementsByTagName('button');

document.addEventListener('DOMContentLoaded', function () {
  const username = localStorage.getItem('username');
  const pomodoroDuration = localStorage.getItem('pomodoroDuration');
  const pomodoroPause = localStorage.getItem('pomodoroPause');
  const pomodoroLongPause = localStorage.getItem('pomodoroLongPause');
  const difficulty = localStorage.getItem('difficulty');

  // Se algum valor estiver ausente, exibe o modal
  if (!username || !pomodoroDuration || !difficulty) {
    modalPomodoroConfig();
  } else {
    // Se os valores estiverem presentes, preenche os campos
    document.getElementById('username').value = username;
    document.getElementById('pomodoroDuration').value = pomodoroDuration;
    document.getElementById('pomodoroPause').value = pomodoroPause;
    document.getElementById('pomodoroLongPause').value = pomodoroLongPause;
    document.getElementById('difficulty').value = difficulty;
    changeBackgroundByDifficulty();
  }
});

// exibe o modal de configurações
function modalPomodoroConfig() {
  const hiddenDiv = document.getElementById('modal');
  hiddenDiv.classList.toggle('showModal');
}

// pega os valores da configuração e salva no localStorage
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('configPomodoro');

  // Adiciona um ouvinte de evento para o envio do formulário
  form.addEventListener('submit', function (event) {
    // Previne o comportamento padrão do formulário (recarregar a página)
    event.preventDefault();

    // Obtém os valores dos inputs
    const username = document.getElementById('username').value;
    const pomodoroDuration = document.getElementById('pomodoroDuration').value;
    const pomodoroPause = document.getElementById('pomodoroPause').value;
    const pomodoroLongPause =
      document.getElementById('pomodoroLongPause').value;
    const difficulty = document.getElementById('difficulty').value;

    // Salva os valores no localStorage
    localStorage.setItem('username', username);
    localStorage.setItem('pomodoroDuration', pomodoroDuration);
    localStorage.setItem('pomodoroPause', pomodoroPause);
    localStorage.setItem('pomodoroLongPause', pomodoroLongPause);
    localStorage.setItem('difficulty', difficulty);

    // Chama a função para ocultar o modal de configurações do Pomodoro
    modalPomodoroConfig();
    changeBackgroundByDifficulty();
  });
});
function changeBackgroundByDifficulty() {
  let difficulty = localStorage.getItem('difficulty');
  console.log(difficulty);
  let elementsToChange = document.querySelectorAll('.change-background');
  let backgroundClass = '';

  switch (difficulty) {
    case 'begginer':
      backgroundClass = 'fundoVerde';
      break;
    case 'intermediate':
      backgroundClass = 'fundoAzul';
      break;
    case 'expert':
      backgroundClass = 'fundoVermelho';
      break;
  }

  elementsToChange.forEach((element) => {
    element.classList.remove('fundoVerde', 'fundoAzul', 'fundoVermelho');
    element.classList.add(backgroundClass);
  });
}

// TESTE
// para ver se as informacoes foram salvas corretamente ou existem no localStorage:
console.log('Nome: ', localStorage.getItem('username'));
console.log('Duração do pomodoro: ', localStorage.getItem('pomodoroDuration'));
console.log('Duração da pausa: ', localStorage.getItem('pomodoroPause'));
console.log(
  'Duração da pausa longa: ',
  localStorage.getItem('pomodoroLongPause')
);
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
