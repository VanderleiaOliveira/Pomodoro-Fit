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
