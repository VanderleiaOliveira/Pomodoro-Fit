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
  changeTextColorByDifficultyInConfigButton();
  startStretchingPause();
}

function hideStretchingModal() {
  const durationMinutes =
    parseInt(localStorage.getItem('pomodoroDuration')) || 25;
  timeLeftInSeconds = durationMinutes * 60;
  updateCountdownDisplay();
  const modalStretchingBg = document.getElementById('modal-stretching');
  modalStretchingBg.classList.remove('showModal');
}

// para inicializar o sistema

document.addEventListener('DOMContentLoaded', function () {
  // Verifica se a chave 'pause' existe no localStorage e, se não, define como '0' para não reiciar ela toda vez que atualizar as configurações
  if (localStorage.getItem('pause') === null) {
    localStorage.setItem('pause', '0');
  }
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

    changeBackgroundByDifficulty();
    updateLevelProgress();
    const durationMinutes =
      parseInt(localStorage.getItem('pomodoroDuration')) || 25;
    timeLeftInSeconds = durationMinutes * 60;
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
    changeTextColorByDifficultyInConfigButton();
    const durationMinutes =
      parseInt(localStorage.getItem('pomodoroDuration')) || 25;
    timeLeftInSeconds = durationMinutes * 60;
    updateCountdownDisplay();
    updateLevelProgress();
  });
});

// muda a cor do fundo e dos botões conforme a dificuldade escolhida pelo usuário
function changeBackgroundByDifficulty() {
  let difficulty = localStorage.getItem('difficulty');
  // console.log(difficulty);
  // a classe change-background deve ser colocada em todos elementos que precisam ter seus fundos alterados
  //abaixo estes elementos são selecionados
  let elementsToChange = document.querySelectorAll('.change-background');
  let backgroundClass = '';

  switch (difficulty) {
    case 'beginner':
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

function changeTextColorByDifficultyInConfigButton() {
  let difficulty = localStorage.getItem('difficulty');
  // console.log(difficulty);
  // Seleciona os elementos que terão a cor do texto alterada
  let elementsToChangeTextColor =
    document.querySelectorAll('.change-text-color');
  let textColorClass = '';

  switch (difficulty) {
    case 'beginner':
      textColorClass = 'textoVerde';
      break;
    case 'intermediate':
      textColorClass = 'textoAzul';
      break;
    case 'expert':
      textColorClass = 'textoVermelho';
      break;
  }

  // Itera sobre os elementos selecionados e atualiza a classe de cor do texto
  elementsToChangeTextColor.forEach((element) => {
    element.classList.remove('textoVerde', 'textoAzul', 'textoVermelho');
    element.classList.add(textColorClass);
  });
}

// parte da gamificação do pomodoro:
async function updateLevelProgress() {
  const username = localStorage.getItem('username'); // Obtém o nome do usuário do localStorage
  const difficulty = localStorage.getItem('difficulty');
  const stretchings = await loadStretchings(); // Assumindo que essa função retorna todos os alongamentos disponíveis
  const previousStretchings = JSON.parse(
    localStorage.getItem('previousStretchings') || '[]'
  );

  const totalForDifficulty = stretchings.filter(
    (stretch) => stretch.difficulty === difficulty
  ).length;
  const remaining = totalForDifficulty - previousStretchings.length;

  // Atualiza o texto do link com o número de alongamentos restantes
  document.getElementById('level').innerText = `${remaining}`;

  // Atualiza o atributo title do link
  const levelLink = document.getElementById('level');
  if (username) {
    // Verifica se o nome do usuário existe antes de tentar usar
    levelLink.setAttribute(
      'title',
      `${username}, você ainda tem ${remaining} alongamentos para concluir este nível`
    );
  } else {
    // Caso o nome do usuário não esteja disponível, pode definir um texto padrão
    levelLink.setAttribute(
      'title',
      `Você ainda tem ${remaining} alongamentos para concluir este nível`
    );
  }
}

let countdownInterval;
let timeLeftInSeconds;
let isPomodoroRunning = false;
//  a função abaixo alterna o icone do botão de iniciar ou pausar o pomodoro
function updateCountdownDisplay() {
  const minutes = Math.floor(timeLeftInSeconds / 60);
  const seconds = timeLeftInSeconds % 60;
  document.getElementById('pomodoroCountdown').textContent = `${String(
    minutes
  ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
function togglePomodoro(event) {
  // console.log(isPomodoroRunning);
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
// carrega o som de fim do pomodoro
const pomodoroEndSound = new Audio('/assets/sounds/pomodoro-end.mp3');
function startPomodoro() {
  const playPauseIcon = document.getElementById('playPauseIcon');
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
          pomodoroEndSound.play(); // Reproduz o som de fim de Pomodoro
          showStretchingModal(); // Exibe o modal de alongamento ao final do Pomodoro
          showStretching();
          playPauseIcon.classList.replace('fa-pause', 'fa-play');
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
  // Limpa o intervalo de contagem regressiva existente, se houver
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  // Reseta o estado de execução do Pomodoro isso precisa lá para os botões de play/pause e o startPomodoro funcionar corretamente
  isPomodoroRunning = false;

  // Define `timeLeftInSeconds` para a duração padrão do Pomodoro ou uma customizada pelo usuário
  const durationMinutes =
    parseInt(localStorage.getItem('pomodoroDuration')) || 25;
  timeLeftInSeconds = durationMinutes * 60;

  // Atualiza o display do contador para refletir o tempo resetado
  updateCountdownDisplay();

  // Atualiza o ícone do botão play/pause para "play" pq provavelmente o botão vai estar exibindo pause
  const playPauseIcon = document.getElementById('playPauseIcon');
  if (playPauseIcon.classList.contains('fa-pause')) {
    playPauseIcon.classList.replace('fa-pause', 'fa-play');
  }
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
      case 'beginner':
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
  // Encerra o contador de pausa
  if (pauseCountDownInterval) {
    clearInterval(pauseCountDownInterval);
    pauseCountDownInterval = null;
  }

  // Incrementa o contador de pausas e verifica se deve reiniciar para uma pausa longa
  incrementPauseCount();

  // Fecha o modal de alongamento
  hideStretchingModal();

  // Limpa o conteúdo do alongamento (se necessário)
  document.getElementById('stretchingName').textContent = '';
  document.getElementById('stretchingEquipment').textContent = '';
  document.getElementById('stretchingMuscle').textContent = '';
  document.getElementById('stretchingInstructions').textContent = '';

  // Incrementa o total de alongamentos feitos
  const totalStretchingDone =
    parseInt(localStorage.getItem('totalStretchingDone') || '0') + 1;
  localStorage.setItem('totalStretchingDone', totalStretchingDone.toString());

  // Atualiza o progresso no nível
  updateLevelProgress();
}

// pausas do pomodoro
let pauseCountDownInterval;
let pauseTimeLeftInSeconds;

function updatePauseCountDownDisplay() {
  const minutes = Math.floor(pauseTimeLeftInSeconds / 60);
  const seconds = pauseTimeLeftInSeconds % 60;
  document.getElementById('pauseCountDown').textContent = `${String(
    minutes
  ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// carrega o som de fim da pausa
const pomodoroEndPauseSoung = new Audio('/assets/sounds/pause-end.mp3');

function startStretchingPause() {
  const pauseCount = parseInt(localStorage.getItem('pause')) || 0;
  const isLongPause = pauseCount === 4;

  const pauseDuration = isLongPause
    ? parseInt(localStorage.getItem('pomodoroLongPause'))
    : parseInt(localStorage.getItem('pomodoroPause'));

  // console.log(
  //   `Iniciando ${
  //     isLongPause ? 'uma pausa longa' : 'uma pausa curta'
  //   } de ${pauseDuration} minutos.`
  // );

  pauseTimeLeftInSeconds = pauseDuration * 60;
  updatePauseCountDownDisplay();

  pauseCountDownInterval = setInterval(() => {
    if (pauseTimeLeftInSeconds > 0) {
      pauseTimeLeftInSeconds--;
      updatePauseCountDownDisplay();
    } else {
      clearInterval(pauseCountDownInterval);
      pauseCountDownInterval = null;
      pomodoroEndPauseSoung.play();
    }
  }, 1000);
}

function incrementPauseCount() {
  let pauseCount = parseInt(localStorage.getItem('pause')) || 0;

  // Incrementa o contador de pausas até 4, então reinicia para a próxima ser uma pausa longa
  if (pauseCount === 4) {
    console.log(`Pausa atual: ${pauseCount} - Próxima será uma pausa curta.`);
    localStorage.setItem('pause', '0'); // Reinicia o contador de pausas
  } else {
    pauseCount++;
    console.log(
      `Pausa atual: ${pauseCount} - ${
        pauseCount === 4
          ? 'Próxima será uma pausa longa'
          : 'Próxima será uma pausa curta'
      } de ${
        pauseCount === 4
          ? localStorage.getItem('pomodoroLongPause')
          : localStorage.getItem('pomodoroPause')
      } minutos.`
    );
    localStorage.setItem('pause', pauseCount.toString());
  }
}
