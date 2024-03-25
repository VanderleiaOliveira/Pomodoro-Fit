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
  }
});

// exibe o modal de configurações
function modalPomodoroConfig() {
  const hiddenDiv = document.getElementById('modal');
  hiddenDiv.classList.toggle('showModal');
}
