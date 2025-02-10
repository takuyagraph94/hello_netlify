let scene, camera, renderer;
init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 3;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  let boxGeom = new THREE.BoxGeometry();
  let boxMat = new THREE.MeshBasicMaterial({color:0xff0000});
  let box = new THREE.Mesh(boxGeom, boxMat);
  scene.add(box);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
