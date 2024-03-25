document.addEventListener('DOMContentLoaded', function () {
  const username = localStorage.getItem('username');
  const pomodoroDuration = localStorage.getItem('pomodoroDuration');
  const difficulty = localStorage.getItem('difficulty');

  // Se algum valor estiver ausente, exibe o modal
  if (!username || !pomodoroDuration || !difficulty) {
    modalPomodoroConfig();
  } else {
    // Se os valores estiverem presentes, preenche os campos
    document.getElementById('username').value = username;
    document.getElementById('pomodoroDuration').value = pomodoroDuration;
    document.getElementById('difficulty').value = difficulty;
  }
});

function modalPomodoroConfig() {
  const hiddenDiv = document.getElementById('conteudoOculto');
  hiddenDiv.classList.toggle('hidden-config');
}
