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
