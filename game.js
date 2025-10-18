const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let bird = { x: 50, y: 150, velocity: 0 };
let gravity = 0.6;
let lift = -10; // Pulos menores para facilitar
let pipes = [];
let score = 0;
let gameOver = false;
let pipeSpeed = 2; // Velocidade inicial dos canos
let fireworks = []; // Array para fogos de artifício
let showFireworks = false;
let fireworksTimer = 0;

// Função para desenhar a galinha
function drawBird() {
  // Corpo (oval amarelo)
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.ellipse(bird.x + 10, bird.y + 15, 10, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cabeça (círculo laranja)
  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.arc(bird.x + 10, bird.y + 5, 8, 0, Math.PI * 2);
  ctx.fill();

  // Bico (triângulo vermelho)
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.moveTo(bird.x + 18, bird.y + 5);
  ctx.lineTo(bird.x + 22, bird.y + 3);
  ctx.lineTo(bird.x + 22, bird.y + 7);
  ctx.closePath();
  ctx.fill();

  // Olhos (círculos pretos)
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(bird.x + 12, bird.y + 3, 2, 0, Math.PI * 2);
  ctx.arc(bird.x + 8, bird.y + 3, 2, 0, Math.PI * 2);
  ctx.fill();

  // Pernas (linhas marrons)
  ctx.strokeStyle = "brown";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bird.x + 8, bird.y + 25);
  ctx.lineTo(bird.x + 6, bird.y + 30);
  ctx.moveTo(bird.x + 12, bird.y + 25);
  ctx.lineTo(bird.x + 14, bird.y + 30);
  ctx.stroke();
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach((pipe) => {
    ctx.fillRect(pipe.x, 0, 50, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, 50, pipe.bottom);
  });
}

// Função para criar fogos de artifício
function createFireworks() {
  for (let i = 0; i < 20; i++) {
    fireworks.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      color: ["red", "blue", "yellow", "green", "purple"][
        Math.floor(Math.random() * 5)
      ],
      life: 60,
    });
  }
}

function update() {
  if (gameOver) return;
  bird.velocity += gravity;
  bird.y += bird.velocity;
  if (bird.y + 30 > canvas.height || bird.y < 0) {
    gameOver = true;
  }
  pipes.forEach((pipe) => {
    pipe.x -= pipeSpeed; // Usa velocidade variável
    if (pipe.x + 50 < bird.x && !pipe.scored) {
      score += 5;
      pipe.scored = true;
      // A cada 100 pontos, aumenta dificuldade e ativa fogos
      if (score % 100 === 0) {
        pipeSpeed += 0.5;
        gravity += 0.1;
        showFireworks = true;
        fireworksTimer = 120; // Mostra por 2 segundos (60 FPS)
        createFireworks();
      }
    }
    if (bird.x + 20 > pipe.x && bird.x < pipe.x + 50) {
      if (bird.y < pipe.top || bird.y + 30 > canvas.height - pipe.bottom) {
        gameOver = true;
        showAlert();

      }
    }
  });
  if (pipes.length === 0 || pipes[pipes.length - 1].x < 150) {
    let topHeight = Math.random() * 200 + 50;
    let bottomHeight = Math.random() * 200 + 50;
    while (topHeight + bottomHeight + 100 > canvas.height) {
      bottomHeight = Math.random() * 200 + 50;
    }
    pipes.push({
      x: canvas.width,
      top: topHeight,
      bottom: bottomHeight,
      scored: false,
    });
  }
  pipes = pipes.filter((pipe) => pipe.x + 50 > 0);

  // Atualiza fogos
  if (showFireworks) {
    fireworks.forEach((f) => {
      f.x += f.vx;
      f.y += f.vy;
      f.vy += 0.1; // Gravidade nas partículas
      f.life--;
    });
    fireworks = fireworks.filter((f) => f.life > 0);
    fireworksTimer--;
    if (fireworksTimer <= 0) {
      showFireworks = false;
      fireworks = [];
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();

  // Desenha fogos se ativo
  if (showFireworks) {
    fireworks.forEach((f) => {
      ctx.fillStyle = f.color;
      ctx.beginPath();
      ctx.arc(f.x, f.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
  if (gameOver) {
    ctx.fillText("Fim de Jogo!", canvas.width / 2 - 50, canvas.height / 2);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function showAlert() {
  document.getElementById("customAlert").style.display = "flex";
}

function closeAlert() {
  document.getElementById("customAlert").style.display = "none";
}

canvas.addEventListener("click", () => {
  if (!gameOver) {
    bird.velocity = lift;
  } else {
    bird = { x: 50, y: 150, velocity: 0 };
    pipes = [];
    score = 0;
    gameOver = false;
    pipeSpeed = 2; // Reseta velocidade
    gravity = 0.6; // Reseta gravidade
    showFireworks = false;
    fireworks = [];
  }
});

gameLoop();
