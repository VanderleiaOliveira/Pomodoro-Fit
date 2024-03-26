// para o modal:
function showModal() {
  const modalBg = document.getElementById('modal');
  modalBg.classList.add('showModal');
}

function hideModal() {
  const modalBg = document.getElementById('modal');
  modalBg.classList.remove('showModal');
}

function showStretchingModal() {
  const modalStretchingBg = document.getElementById('modal-stretching');
  modalStretchingBg.classList.add('showModal');
}

function hideStretchingModal() {
  const modalStretchingBg = document.getElementById('modal-stretching');
  modalStretchingBg.classList.remove('showModal');
}

// para inicializar o sistema

document.addEventListener('DOMContentLoaded', function () {
  // a função abaixo garante que na inicialização do sistema o modal de alongamentos não seja exibido
  hideStretchingModal();

  const username = localStorage.getItem('username');
  const pomodoroDuration = localStorage.getItem('pomodoroDuration');
  const pomodoroPause = localStorage.getItem('pomodoroPause');
  const pomodoroLongPause = localStorage.getItem('pomodoroLongPause');
  const difficulty = localStorage.getItem('difficulty');

  // Se algum valor estiver ausente, exibe o modal
  if (!username || !pomodoroDuration || !difficulty) {
    showModal();
  } else {
    hideModal();
    // Se os valores estiverem presentes, preenche os campos
    document.getElementById('username').value = username;
    document.getElementById('pomodoroDuration').value = pomodoroDuration;
    document.getElementById('pomodoroPause').value = pomodoroPause;
    document.getElementById('pomodoroLongPause').value = pomodoroLongPause;
    document.getElementById('difficulty').value = difficulty;

    updateTimerDisplay();
    changeBackgroundByDifficulty();
    const durationMinutes =
      parseInt(localStorage.getItem('pomodoroDuration')) || 25;
    timeLeftInSeconds = durationMinutes * 60; // Configura o tempo inicial

    updateCountdownDisplay(); // Atualiza o display pela primeira vez
  }

  // area de salva na localStorage as configurações do pomodoro e o nome do usário
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
    hideModal();
    changeBackgroundByDifficulty();
  });
});

// exibe o valor do tempo do pomodoro armazenado na localStorage no contador
function updateTimerDisplay() {
  const durationMinutes = localStorage.getItem('pomodoroDuration') || 25;
  document.getElementById(
    'pomodoroCountdown'
  ).textContent = `${durationMinutes}:00`;
}

// muda a cor do fundo e dos botões conforme a dificuldade escolhida pelo usuário
function changeBackgroundByDifficulty() {
  let difficulty = localStorage.getItem('difficulty');
  console.log(difficulty);
  // a classe change-background deve ser colocada em todos elementos que precisam ter seus fundos alterados
  //abaixo estes elementos são selecionados
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
  // no case  pela dificuldade define a cor do fundo dos elementos
  // já abaixo, ele primeiro remove a classe pradrão dos elementos e coloca a classe de cor conforme a dificuldade
  elementsToChange.forEach((element) => {
    element.classList.remove('fundoVerde', 'fundoAzul', 'fundoVermelho');
    element.classList.add(backgroundClass);
  });
}

let countdownInterval;
let timeLeftInSeconds;
let isPomodoroRunning = false;
//  a função abaixo alterna o icone do botão de iniciar ou pausar o pomodoro

function togglePomodoro(event) {
  console.log(isPomodoroRunning);
  event.preventDefault();
  const playPauseIcon = document.getElementById('playPauseIcon');

  if (!isPomodoroRunning) {
    startPomodoro();
    playPauseIcon.classList.replace('fa-play', 'fa-pause');
  } else {
    pausePomodoro();
    playPauseIcon.classList.replace('fa-pause', 'fa-play');
  }
}

function startPomodoro() {
  if (!isPomodoroRunning) {
    // Se o Pomodoro não estiver rodando, prepare para iniciar ou continuar
    if (!countdownInterval) {
      // Define a duração apenas se o Pomodoro está começando do início
      if (timeLeftInSeconds <= 0) {
        const durationMinutes =
          parseInt(localStorage.getItem('pomodoroDuration')) || 25;
        timeLeftInSeconds = durationMinutes * 60;
      }

      updateCountdownDisplay(); // Atualiza o display inicialmente.

      countdownInterval = setInterval(() => {
        if (timeLeftInSeconds > 0) {
          timeLeftInSeconds--;
          updateCountdownDisplay();
        } else {
          clearInterval(countdownInterval);
          countdownInterval = null; // Limpa o intervalo de contagem regressiva
          isPomodoroRunning = false; // Atualiza o estado do Pomodoro
          showStretchingModal(); // Exibe o modal de alongamento ao final do Pomodoro
          showStretching();
        }
      }, 1000);
    }
    isPomodoroRunning = true; // Marca o Pomodoro como ativo
  }
}

function pausePomodoro() {
  if (isPomodoroRunning && countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
    isPomodoroRunning = false;
  }
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

// ALONGAMENTOS :
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

    // Determina a imagem com base na dificuldade
    let imageUrl;
    switch (difficulty) {
      case 'begginer':
        imageUrl = '/assets/img/alongamentos/iniciante.png';
        break;
      case 'intermediate':
        imageUrl = '/assets/img/alongamentos/intermediario.png';
        break;
      case 'expert':
        imageUrl = '/assets/img/alongamentos/avancado.png';
        break;
      default:
        imageUrl = '/assets/img/alongamentos/default.png'; // Imagem padrão caso necessário
    }

    // Atualiza o elemento de imagem com a URL correta
    const imageElement = document.getElementById('stretchingImage');
    imageElement.innerHTML = `<img src="${imageUrl}" width="350px">`;

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
