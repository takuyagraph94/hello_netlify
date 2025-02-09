// グローバル変数
let scene, camera, renderer;
let cube;      // 赤い立方体用
let diceModel; // .glbのサイコロモデル用

init();
animate();

function init() {
  // シーンを作成
  scene = new THREE.Scene();

  // カメラ設定
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 8);

  // レンダラー
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // 簡単なライト
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 5);
  scene.add(directionalLight);

  // 背景色
  scene.background = new THREE.Color(0x333333);

  // ===== 赤い立方体（テスト用） =====
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  cube = new THREE.Mesh(geometry, material);
  cube.position.set(-2, 0, 0);  // 左側に配置
  scene.add(cube);

  // ===== dice.glbを読み込む =====
  const loader = new THREE.GLTFLoader();
  loader.load(
    'assets/dice.glb',   // モデルファイルのパス
    (gltf) => {
      diceModel = gltf.scene;
      diceModel.position.set(2, 0, 0); // 右側に配置
      diceModel.scale.set(1, 1, 1);    // サイズ調整（必要なら変える）
      scene.add(diceModel);
    },
    undefined,
    (error) => {
      console.error('dice.glb 読み込み失敗:', error);
    }
  );

  // ウィンドウリサイズ対応
  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  // 赤い立方体を回転
  if (cube) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.02;
  }

  // サイコロモデルも回転
  if (diceModel) {
    diceModel.rotation.x += 0.01;
    diceModel.rotation.y += 0.02;
  }

  renderer.render(scene, camera);
}
