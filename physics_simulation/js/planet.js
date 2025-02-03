// --- シーン、カメラ、レンダラーの作成 ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const defaultCameraPosition = new THREE.Vector3(0, 150, 250);
const defaultLookAt = new THREE.Vector3(0, 0, 0);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1500
);
camera.position.copy(defaultCameraPosition);
camera.lookAt(defaultLookAt);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- 太陽の作成 ---
const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xff5500 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// 点光源を太陽位置に追加（シーン全体に明るさを与える）
const pointLight = new THREE.PointLight(0xffffff, 1.5, 0);
pointLight.position.copy(sun.position);
scene.add(pointLight);

// --- 各惑星およびその軌道の作成 ---
const planets = []; // 惑星の mesh とパラメータ

planetData.forEach(data => {
    // 惑星のメッシュ作成
    const geometry = new THREE.SphereGeometry(data.size, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: data.color });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 軌道ラインの作成：円周上の点を自前で計算
    const segments = 128;
    const orbitPoints = [];
    for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const x = data.orbitRadius * Math.cos(angle);
        const z = data.orbitRadius * Math.sin(angle);
        orbitPoints.push(new THREE.Vector3(x, 0, z));
    }
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        opacity: 0.3,
        transparent: true
    });
    const orbitLine = new THREE.LineLoop(orbitGeometry, orbitMaterial);
    scene.add(orbitLine);

    // 配列に登録（名前も保持）
    planets.push({
        name: data.name,
        mesh: mesh,
        orbitRadius: data.orbitRadius,
        orbitPeriod: data.orbitPeriod
    });
});

// --- DOM に惑星リストを作成 ---
const planetListEl = document.querySelector('#planetList ul');
planets.forEach(planet => {
    const li = document.createElement('li');
    li.textContent = planet.name;
    // クリック時にズームするイベントを設定
    li.addEventListener('click', () => {
        // ズーム先の目標位置（惑星の現在の位置）
        const targetPosition = planet.mesh.position.clone();
        // カメラを惑星に近づけるためのオフセット（例：上方向に 10、奥方向に 20）
        const offset = new THREE.Vector3(0, 10, 20);
        const newCameraPos = targetPosition.clone().add(offset);

        // カメラ位置を更新（ここでは即時更新ですが、Tween などでスムーズに移動させても良い）
        camera.position.copy(newCameraPos);
        camera.lookAt(targetPosition);
    });
    planetListEl.appendChild(li);
});

// --- ズームリセットボタンの処理 ---
const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', () => {
    camera.position.copy(defaultCameraPosition);
    camera.lookAt(defaultLookAt);
});

// --- アニメーションループ ---
function animate() {
    requestAnimationFrame(animate);

    const elapsed = performance.now() / 1000; // 経過時間（秒）

    // 各惑星の位置更新
    planets.forEach(planet => {
        const angle = (elapsed / planet.orbitPeriod) * Math.PI * 2;
        planet.mesh.position.x = planet.orbitRadius * Math.cos(angle);
        planet.mesh.position.z = planet.orbitRadius * Math.sin(angle);
    });

    renderer.render(scene, camera);
}
animate();

// --- ウィンドウリサイズ対応 ---
window.addEventListener("resize", () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
