let camera, scene, renderer, controls, clock;

function setup() {
  document.body.style.backgroundColor = "#d7f0f7";

  setupThreeJS();
  setupWorld();

  requestAnimationFrame(function animate() {
    renderer.render(scene, camera);
    controls.update(clock.getDelta());
    requestAnimationFrame(animate);
  });
}

function setupThreeJS() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.y = 400;
  camera.position.z = 700;
  camera.rotation.x = (-30 * Math.PI) / 180;

  renderer = new THREE.WebGLRenderer({ antialias: true }); //Soft pixels
  renderer.setSize(window.innerWidth, window.innerHeight);
  //Sombras
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.soft = true;
  renderer.setClearColor(0x7ec0ee, 1);

  clock = new THREE.Clock();
  controls = new THREE.FirstPersonControls(camera);
  controls.movementSpeed = 100;
  controls.lookSpeed = 0.3;

  document.body.appendChild(renderer.domElement);
}

function setupWorld() {
  let geo = new THREE.BoxGeometry(2000, 2000, 1, 20, 20, 1); //Boxes
  let mat = new THREE.MeshPhongMaterial({ color: 0x9db3b5 }); //Phong Material (reflex light)
  let floor = new THREE.Mesh(geo, mat); //Floor

  floor.rotation.x = (-90 * Math.PI) / 180;
  floor.receiveShadow = true; //Floor receive shadows
  scene.add(floor);

  let geometry = new THREE.CubeGeometry(1, 1, 1);

  geometry.applyMatrix(
    new THREE.Matrix4().makeTranslation(0, 0.5, 0));

  //Without city geometry and lights
  /*
  let material = new THREE.MeshNormalMaterial();
  
  for (let i = 0; i < 300; i++) {
    let building = new THREE.Mesh(geometry.clone(), material.clone());
    building.position.x = Math.floor(Math.random() * 200 - 100) * 4;
    building.position.z = Math.floor(Math.random() * 200 - 100) * 4;
    building.scale.x = Math.random() * 50 + 10;
    building.scale.y = Math.random() * building.scale.x * 8 + 8;
    building.scale.z = building.scale.x;
    scene.add(building);
  }
  */

  //With city geometry and lights
  let material = new THREE.MeshPhongMaterial({ color: 0x3b3b3b });

  let cityGeometry = new THREE.Geometry();

  for (let i = 0; i < 300; i++) {
    let building = new THREE.Mesh(geometry.clone());
    building.position.x = Math.floor(Math.random() * 200 - 100) * 4;
    building.position.z = Math.floor(Math.random() * 200 - 100) * 4;
    building.scale.x = Math.random() * 50 + 10;
    building.scale.y = Math.random() * building.scale.x * 8 + 8;
    building.scale.z = building.scale.x;
    building.updateMatrix();
    cityGeometry.merge(building.geometry, building.matrix);
  }
  let city = new THREE.Mesh(cityGeometry, material);

  //Shadows & lights
  city.castShadow = true;
  city.receiveShadow = true;

  let light = new THREE.DirectionalLight(0xf6e86d, 1); //Light
  light.castShadow = true;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  light.position.set(1500, 1500, 1000);
  light.shadow.camera.far = 2500;
  light.shadow.camera.left = -1000;
  light.shadow.camera.right = 1000;
  light.shadow.camera.top = 1000;
  light.shadow.camera.bottom = -1000;
  light.shadow.darkness = 0.5;
  scene.add(light);

  scene.add(new THREE.AmbientLight(0x666666));
  scene.fog = new THREE.FogExp2(0x9db3b5, 0.002);

  //Add city geometry
  scene.add(city);
}

setup();
