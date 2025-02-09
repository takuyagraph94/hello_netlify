// script.js

let scene, camera, renderer;
let dice; // サイコロモデルを格納する変数

init();
animate();

// 初期化
function init() {
  // シーンを作成
  scene = new THREE.Scene();

  // カメラ
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 5);

  // レンダラー
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // bodyにcanvasを追加
  document.body.appendChild(renderer.domElement);

  // 簡単なライト（環境光）
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  // 方向光（太陽光イメージ）
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 5);
  scene.add(directionalLight);

  // 背景をちょっと暗い色に
  scene.background = new THREE.Color(0x333333);

  // ウィンドウリサイズ対応
  window.addEventListener('resize', onWindowResize);

  // GLTFLoaderでdice.glbを読み込み
  const loader = new THREE.GLTFLoader();
  loader.load(
    'assets/dice.glb', // モデルファイルのパス（index.htmlからの相対パス）
    (gltf) => {
      dice = gltf.scene;
      // サイコロの大きさや位置を調整
      dice.scale.set(1, 1, 1);
      dice.position.set(0, 0, 0);
      scene.add(dice);
    },
    undefined,
    (error) => {
      console.error('Failed to load dice model:', error);
    }
  );
}

// ウィンドウリサイズ時
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// アニメーションループ
function animate() {
  requestAnimationFrame(animate);

  // diceが読み込まれていたら少し回転させてみる
  if (dice) {
    dice.rotation.x += 0.01;
    dice.rotation.y += 0.02;
  }

  renderer.render(scene, camera);
}
