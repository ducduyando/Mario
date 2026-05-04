import "./style.css";
import { Game } from "./game/Game.js";

const canvas = document.getElementById("game");
const hud = document.getElementById("hud");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
const game = new Game();
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const MASTER_VOLUME = 0.3;

const assets = {
  coinSfx: "/assets/audio/coin.wav",
  winSfx: "/assets/audio/win.wav"
};

const input = {
  left: false,
  right: false,
  jump: false
};

let animationClock = 0;
let facing = 1;
let soundAssets;
let bgmTimerId;

const bgmPattern = [
  { freq: 330, duration: 0.14 },
  { freq: 392, duration: 0.14 },
  { freq: 523, duration: 0.22 },
  { freq: 392, duration: 0.14 },
  { freq: 330, duration: 0.22 },
  { freq: 294, duration: 0.14 },
  { freq: 262, duration: 0.26 }
];

async function loadAssets() {
  const [coinSfx, winSfx] = await Promise.all([
    new Audio(assets.coinSfx),
    new Audio(assets.winSfx)
  ]);
  return {
    sounds: { coinSfx, winSfx }
  };
}

function playGeneratedTone({ freq, duration, type = "square", gain = 0.07, rampTo = 0.0001 }) {
  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const amp = audioContext.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  amp.gain.setValueAtTime(gain * MASTER_VOLUME, now);
  amp.gain.exponentialRampToValueAtTime(rampTo, now + duration);
  osc.connect(amp);
  amp.connect(audioContext.destination);
  osc.start(now);
  osc.stop(now + duration);
}

function playSound(audio) {
  audio.volume = 0.28;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function playChord(baseFreq, duration = 0.22, gain = 0.02) {
  [1, 1.25, 1.5].forEach((ratio) => {
    playGeneratedTone({
      freq: baseFreq * ratio,
      duration,
      type: "triangle",
      gain,
      rampTo: 0.0002
    });
  });
}

function startBackgroundMusic() {
  if (bgmTimerId) return;
  let index = 0;
  bgmTimerId = window.setInterval(() => {
    if (game.finished) return;
    const note = bgmPattern[index];
    playGeneratedTone({
      freq: note.freq,
      duration: note.duration,
      type: "triangle",
      gain: 0.006
    });
    index = (index + 1) % bgmPattern.length;
  }, 240);
}

function onKeyChange(event, value) {
  if (event.code === "ArrowLeft" || event.code === "KeyA") input.left = value;
  if (event.code === "ArrowRight" || event.code === "KeyD") input.right = value;
  if (event.code === "ArrowUp" || event.code === "Space" || event.code === "KeyW") {
    input.jump = value;
  }
}

window.addEventListener("keydown", (event) => onKeyChange(event, true));
window.addEventListener("keyup", (event) => onKeyChange(event, false));

window.addEventListener("keydown", () => {
  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }
  startBackgroundMusic();
}, { once: true });

function drawPlayer(cameraX) {
  const drawX = game.player.x - cameraX;
  const drawY = game.player.y;
  const bodyW = game.player.width;
  const bodyH = game.player.height;
  const legSwing = Math.abs(game.player.vx) > 5 ? Math.floor(animationClock * 14) % 2 : 0;
  ctx.save();
  if (facing > 0) {
    ctx.translate(drawX + bodyW, drawY);
    ctx.scale(-1, 1);
    drawPixelMario(0, 0, bodyW, bodyH, legSwing);
  } else {
    drawPixelMario(drawX, drawY, bodyW, bodyH, legSwing);
  }
  ctx.restore();
}

function drawPixelMario(x, y, width, height, legSwing) {
  const u = Math.max(2, Math.floor(width / 10));
  const ox = x + Math.floor((width - u * 10) / 2);
  const oy = y + Math.floor((height - u * 14) / 2);

  ctx.fillStyle = "#b91c1c";
  ctx.fillRect(ox + u * 1, oy + u * 1, u * 8, u * 2);
  ctx.fillRect(ox + u * 2, oy, u * 5, u);

  ctx.fillStyle = "#f5c79a";
  ctx.fillRect(ox + u * 2, oy + u * 3, u * 6, u * 3);

  ctx.fillStyle = "#1d4ed8";
  ctx.fillRect(ox + u * 2, oy + u * 6, u * 6, u * 4);
  ctx.fillRect(ox + u * 1, oy + u * 7, u * 2, u * 2);
  ctx.fillRect(ox + u * 7, oy + u * 7, u * 2, u * 2);

  ctx.fillStyle = "#7c2d12";
  const leftLegX = legSwing === 0 ? 2 : 3;
  const rightLegX = legSwing === 0 ? 6 : 5;
  ctx.fillRect(ox + u * leftLegX, oy + u * 10, u * 2, u * 4);
  ctx.fillRect(ox + u * rightLegX, oy + u * 10, u * 2, u * 4);
}

function drawBackground(cameraX) {
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  skyGradient.addColorStop(0, "#63b6ff");
  skyGradient.addColorStop(1, "#d5f0ff");
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#dbeafe";
  for (let i = -1; i < 10; i += 1) {
    const x = i * 170 - (cameraX * 0.18) % 170;
    ctx.beginPath();
    ctx.arc(x + 42, 86 + (i % 2) * 18, 26, 0, Math.PI * 2);
    ctx.arc(x + 64, 76 + (i % 2) * 18, 30, 0, Math.PI * 2);
    ctx.arc(x + 90, 86 + (i % 2) * 18, 24, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#86c55b";
  for (let i = -1; i < 8; i += 1) {
    const x = i * 220 - (cameraX * 0.32) % 220;
    ctx.beginPath();
    ctx.moveTo(x, 500);
    ctx.quadraticCurveTo(x + 70, 360, x + 140, 500);
    ctx.fill();
  }

  ctx.fillStyle = "#5ba34a";
  ctx.fillRect(0, 500, canvas.width, 40);
}

function drawEnemy(enemy, cameraX) {
  const x = enemy.x - cameraX;
  const y = enemy.y;
  ctx.fillStyle = "#8b4513";
  ctx.fillRect(x + 2, y + 10, enemy.width - 4, enemy.height - 10);
  ctx.fillStyle = "#5b2d12";
  ctx.fillRect(x + 6, y + 6, 8, 6);
  ctx.fillRect(x + enemy.width - 14, y + 6, 8, 6);
  ctx.fillStyle = "#fef3c7";
  ctx.fillRect(x + 9, y + 16, 4, 4);
  ctx.fillRect(x + enemy.width - 13, y + 16, 4, 4);
}

function drawGoal(goal, cameraX) {
  const x = goal.x - cameraX;
  ctx.fillStyle = "#d1d5db";
  ctx.fillRect(x + 18, goal.y - 20, 6, goal.height + 20);
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.moveTo(x + 24, goal.y - 20);
  ctx.lineTo(x + 56, goal.y - 8);
  ctx.lineTo(x + 24, goal.y + 2);
  ctx.closePath();
  ctx.fill();
}

function render() {
  const { cameraX } = game;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground(cameraX);

  game.platforms.forEach((platform) => {
    ctx.fillStyle = "#8b4513";
    ctx.fillRect(platform.x - cameraX, platform.y, platform.width, platform.height);
    ctx.fillStyle = "#a66a3f";
    ctx.fillRect(platform.x - cameraX, platform.y, platform.width, 10);
  });
  game.pipes.forEach((pipe) => {
    ctx.fillStyle = "#17a34a";
    ctx.fillRect(pipe.x - cameraX, pipe.y, pipe.width, pipe.height);
    ctx.fillStyle = "#0f7e39";
    ctx.fillRect(pipe.x - cameraX - 4, pipe.y, pipe.width + 8, 12);
  });
  game.blocks.forEach((block) => {
    if (block.width <= 0) return;
    if (block.kind === "question" && !block.used) {
      ctx.fillStyle = "#fbbf24";
    } else {
      ctx.fillStyle = "#b45309";
    }
    ctx.fillRect(block.x - cameraX, block.y, block.width, block.height);
    ctx.strokeStyle = "#7c2d12";
    ctx.strokeRect(block.x - cameraX, block.y, block.width, block.height);
  });
  game.enemies.forEach((enemy) => {
    if (enemy.alive) drawEnemy(enemy, cameraX);
  });
  game.coins.forEach((coin) => {
    if (!coin.collected) {
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(coin.x - cameraX + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(coin.x - cameraX + coin.width / 2 - 2, coin.y + 4, 4, coin.height - 8);
    }
  });
  game.powerUps.forEach((item) => {
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(item.x - cameraX + item.width / 2, item.y + item.height / 2, item.width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fef3c7";
    ctx.fillRect(item.x - cameraX + 8, item.y + 12, 6, 6);
    ctx.fillRect(item.x - cameraX + 16, item.y + 12, 6, 6);
  });
  drawGoal(game.goal, cameraX);
  if (game.player.invulnerableFor <= 0 || Math.floor(animationClock * 10) % 2 === 0) {
    drawPlayer(cameraX);
  }

  hud.textContent = `Score: ${game.score} | Lives: ${game.player.lives} | Time: ${Math.ceil(game.timeLeft)} | Form: ${game.player.form} ${
    game.finished ? (game.won ? "| You Win! Press R to restart" : "| Game Over! Press R to restart") : ""
  }`;
}

let lastTime = performance.now();
function loop(currentTime) {
  const dt = Math.min((currentTime - lastTime) / 1000, 0.033);
  lastTime = currentTime;
  animationClock += dt;

  game.update(input, dt);
  if (game.player.vx > 0) facing = 1;
  if (game.player.vx < 0) facing = -1;

  if (game.events.jump) {
    playGeneratedTone({ freq: 620, duration: 0.09, type: "triangle", gain: 0.02 });
  }

  if (game.events.coin) {
    playSound(soundAssets.coinSfx);
  }
  if (game.events.stomp) {
    playGeneratedTone({ freq: 500, duration: 0.08, type: "triangle", gain: 0.018 });
  }
  if (game.events.powerup) {
    playChord(392, 0.24, 0.014);
  }
  if (game.events.hurt) {
    playGeneratedTone({ freq: 220, duration: 0.18, type: "sawtooth", gain: 0.022 });
  }
  if (game.events.win) {
    playSound(soundAssets.winSfx);
    playChord(523, 0.4, 0.03);
  }
  if (game.events.lose) {
    playGeneratedTone({ freq: 130, duration: 0.24, type: "triangle", gain: 0.03 });
  }
  render();
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (event) => {
  if (event.code === "KeyR" && game.finished) {
    game.reset();
    animationClock = 0;
  }
});

loadAssets()
  .then((loadedAssets) => {
    soundAssets = loadedAssets.sounds;
    requestAnimationFrame(loop);
  })
  .catch(() => {
    hud.textContent = "Khong tai duoc asset. Vui long refresh trang.";
  });
