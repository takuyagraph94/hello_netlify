// script.js (ES Modulesで three.module.js + GLTFLoader.js を相対パスimport)
import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';

// グローバル変数
let scene, camera, renderer;
let playerDice, cpuDice;
let round = 1;
let playerWins = 0;
let cpuWins = 0;
let rolling = false;

const maxRounds = 3;

const roundInfoEl = document.getElementById('roundInfo');
const matchInfoEl = document.getElementById('matchInfo');
const rollButton = document.getElementById('rollButton');
const resetButton = document.getElementById('resetButton');
const countdownOverlay = document.getElementById('countdownOverlay');
const finalResultEl = document.getElementById('finalResult');

initScene();
animate();

// イベントリスナー
rollButton.addEventListener('click', () => {
  if(!rolling) {
    startCountdown(() => {
      rollDice();
    });
  }
});
resetButton.addEventListener('click', resetGame);

// ----------------
// Three.js 初期化
// ----------------
function initScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0,3,10);

  renderer = new THREE.WebGLRenderer({ antialias:true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 5);
  scene.add(directionalLight);

  scene.background = new THREE.Color(0x222222);
  window.addEventListener('resize', onWindowResize);

  // GLTFLoader で assets/dice.glb を読み込み
  const loader = new GLTFLoader();
  loader.load(
    'assets/dice.glb',
    (gltf) => {
      // 1P用ダイス
      playerDice = gltf.scene.clone(true);
      playerDice.position.set(-2,0,0);
      scene.add(playerDice);

      // CPU用ダイス
      cpuDice = gltf.scene.clone(true);
      cpuDice.position.set(2,0,0);
      scene.add(cpuDice);
    },
    undefined,
    (error) => console.error('Failed to load dice.glb:', error)
  );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// ----------------
// メインループ
// ----------------
function animate() {
  requestAnimationFrame(animate);

  // rolling=true中はサイコロを回転(演出)
  if (rolling) {
    if (playerDice) {
      playerDice.rotation.x += 0.3;
      playerDice.rotation.y += 0.4;
    }
    if (cpuDice) {
      cpuDice.rotation.x += 0.3;
      cpuDice.rotation.y += 0.4;
    }
  }

  renderer.render(scene, camera);
}

// ----------------
// カウントダウン
// ----------------
function startCountdown(callback) {
  rolling = true;
  const steps = ['3','2','1','GO!!'];
  let index = 0;
  countdownOverlay.classList.add('show');

  const interval = setInterval(() => {
    countdownOverlay.textContent = steps[index];
    index++;
    if(index >= steps.length) {
      clearInterval(interval);
      setTimeout(() => {
        countdownOverlay.classList.remove('show');
        countdownOverlay.textContent = '';
        callback();
      }, 500);
    }
  }, 700);
}

// ----------------
// サイコロを振る
// ----------------
function rollDice() {
  const playerRoll = Math.floor(Math.random()*6)+1;
  const cpuRoll = Math.floor(Math.random()*6)+1;

  // ランダム角度に停止
  if (playerDice) {
    playerDice.rotation.set(
      Math.random()*Math.PI*2,
      Math.random()*Math.PI*2,
      Math.random()*Math.PI*2
    );
  }
  if (cpuDice) {
    cpuDice.rotation.set(
      Math.random()*Math.PI*2,
      Math.random()*Math.PI*2,
      Math.random()*Math.PI*2
    );
  }

  let resultText = `You: ${playerRoll} vs CPU: ${cpuRoll} → `;
  if(playerRoll > cpuRoll) {
    playerWins++;
    resultText += 'You Win!';
  } else if(cpuRoll > playerRoll) {
    cpuWins++;
    resultText += 'You Lose...';
  } else {
    resultText += 'Draw';
  }
  matchInfoEl.textContent = resultText;

  checkGameStatus();
  rolling = false;
}

// ----------------
// 勝敗チェック
// ----------------
function checkGameStatus() {
  roundInfoEl.textContent = `Round: ${round}`;

  if(playerWins === 2) {
    finalResultEl.textContent = 'WINNER';
    finalResultEl.classList.add('visible');
    endGame();
  } else if(cpuWins === 2) {
    finalResultEl.textContent = 'LOSER';
    finalResultEl.classList.add('visible');
    endGame();
  } else {
    round++;
    if(round > maxRounds) {
      finalResultEl.textContent = 'No Winner (Draw)';
      finalResultEl.classList.add('visible');
      endGame();
    }
  }
}

function endGame() {
  rollButton.style.display = 'none';
  resetButton.style.display = 'inline-block';
}

function resetGame() {
  round = 1;
  playerWins = 0;
  cpuWins = 0;
  rolling = false;

  roundInfoEl.textContent = 'Round: 1';
  matchInfoEl.textContent = 'Let\'s Roll!';
  finalResultEl.classList.remove('visible');

  if (playerDice) playerDice.rotation.set(0,0,0);
  if (cpuDice) cpuDice.rotation.set(0,0,0);

  rollButton.style.display = 'inline-block';
  resetButton.style.display = 'none';
}
