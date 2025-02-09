// グローバル変数として一度だけ宣言
let scene, camera, renderer, dice;

// 初期化とアニメーションを呼び出し
init();
animate();

function init() {
  // シーン作成
  scene = new THREE.Scene();

  // カメラ作成 (視野角, アスペクト比, near, far)
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
  document.body.appendChild(renderer.domElement);

  // 簡単なライト
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 5);
  scene.add(directionalLight);

  // ウィンドウのリサイズ対応
  window.addEventListener('resize', onWindowResize);

  // (必要に応じてモデルを読み込む例)
  // const loader = new THREE.GLTFLoader();
  // loader.load('assets/dice.glb', (gltf) => {
  //   dice = gltf.scene;
  //   scene.add(dice);
  // });

  // 背景色を設定 (見やすさのため)
  scene.background = new THREE.Color(0x222222);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  // もしdiceが読み込まれていれば回転させる例
  // if (dice) {
  //   dice.rotation.x += 0.01;
  //   dice.rotation.y += 0.01;
  // }

  renderer.render(scene, camera);
}
