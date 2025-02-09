// グローバル変数を一度だけ宣言
let scene, camera, renderer, cube;

init();
animate();

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
  document.body.appendChild(renderer.domElement);

  // ライト
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 5);
  scene.add(directionalLight);

  // テスト用の赤い立方体
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // リサイズイベント
  window.addEventListener('resize', onWindowResize);

  // 背景色
  scene.background = new THREE.Color(0x333333);

  /*
  // サイコロモデル（dice.glb）を読み込みたい場合は下記をアンコメント
  const loader = new THREE.GLTFLoader();
  loader.load('assets/dice.glb', (gltf) => {
    const diceModel = gltf.scene;
    diceModel.position.set(2, 0, 0); // 右側に表示
    scene.add(diceModel);
  });
  */
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  // 立方体を回転させる
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.02;

  renderer.render(scene, camera);
}
