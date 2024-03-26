let body = document.querySelector('#body');
let button = document.getElementsByTagName('button');

//Beginner - verde
Beginner.addEventListener('click', function () {
  body.classList.toggle('fundoVerde');

  for (let b = 0; b < button.length; b++) {
    button[b].classList.toggle('fundoVerde');
  }
});

// //Intermediate - azul
Intermediate.addEventListener('click', function () {
  body.classList.toggle('fundoAzul');

  for (let b = 0; b < button.length; b++) {
    button[b].classList.toggle('fundoAzul');
  }
});

// // //Advanced - vermelho
Advanced.addEventListener('click', function () {
  body.classList.toggle('fundoVermelho');

  for (let b = 0; b < button.length; b++) {
    button[b].classList.toggle('fundoVermelho');
  }
});
