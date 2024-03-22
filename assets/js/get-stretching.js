let difficulty = ['beginner', 'intermediate', 'expert'];
let muscles = [
  'abdominals',
  'abductors',
  'adductors',
  'biceps',
  'calves',
  'chest',
  'forearms',
  'glutes',
  'hamstrings',
  'lats',
  'lower_back',
  'middle_back',
  'neck',
  'quadriceps',
  'traps',
  'triceps',
];

function loadApiConfig() {
  return fetch('config.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Falha ao carregar a configuração');
      }
      return response.json();
    })
    .catch((error) => console.error('Erro ao carregar configuração:', error));
}

function getApiStreching() {
  loadApiConfig().then((config) => {
    // Inicializa uma array para armazenar as promessas de todas as requisições
    let promises = [];

    difficulty.forEach((dif) => {
      muscles.forEach((muscle) => {
        const url = `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}&type=stretching&difficulty=${dif}`;
        const promise = fetch(url, {
          method: 'GET',
          headers: {
            'X-Api-Key': config.API_KEY,
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            // Retorna os dados para serem incluídos na array de promessas
            return { muscle, dif, data }; // Inclui informações de músculo e dificuldade junto aos dados
          });

        // Adiciona a promessa ao array de promessas
        promises.push(promise);
      });
    });

    // Aguarda todas as promessas serem resolvidas
    Promise.all(promises)
      .then((results) => {
        // Processa e exibe os resultados
        const span = document.getElementById('json');
        span.innerHTML = ''; // Limpa o conteúdo anterior

        results.forEach((result) => {
          // Para cada resultado, adiciona uma representação JSON ao span
          const content = document.createElement('pre'); // Usando 'pre' para formatar
          content.textContent = `Muscle: ${result.muscle}, Difficulty: ${
            result.dif
          }, Data: ${JSON.stringify(result.data, null, 2)}`;
          span.appendChild(content);
        });
      })
      .catch((error) => {
        console.error('Error:', error);
        document.getElementById('json').textContent =
          'Erro ao carregar exercícios.';
      });
  });
}
