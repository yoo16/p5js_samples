let camAngle = 0;    // カメラアングル
let player;          // プレイヤーオブジェクト
let obstacles = [];  // 障害物を格納する配列
const numObstacles = 20; // 障害物の数
const playerSize = 20;

function preload() {
    // 画像ファイルのパスを指定して読み込みます
    playerImage = loadImage("assets/player.png");
}

function setup() {
    // WEBGL モードでキャンバスを作成
    createCanvas(windowWidth, windowHeight, WEBGL);

    // プレイヤーの初期化
    player = new Player(playerSize);

    // ランダムな位置に障害物を生成
    for (let i = 0; i < numObstacles; i++) {
        let x = random(-500, 500);
        let z = random(-500, 500);
        // 障害物の底面が地面に接するように y = 0 で生成
        obstacles.push(new Obstacle(x, 0, z));
    }
}

function draw() {
    background(200, 220, 255);

    // プレイヤーの状態を更新（update() は1回だけ呼ぶ）
    player.update();

    // カメラの設定：プレイヤーの最新状態をもとにカメラを設定
    let cameraDistance = 400;
    let camX = player.pos.x - sin(camAngle) * cameraDistance;
    let camZ = player.pos.z - cos(camAngle) * cameraDistance;
    let camY = player.pos.y - 200;
    camera(camX, camY, camZ, player.pos.x, player.pos.y, player.pos.z, 0, 1, 0);

    // 地面の描画
    push();
    rotateX(HALF_PI);
    fill(180, 240, 180);
    noStroke();
    plane(2000, 2000);
    pop();

    // 障害物の描画
    for (let obs of obstacles) {
        obs.display();
    }

    // プレイヤーの描画
    player.display();

    // 画面上に操作方法のテキストを表示
    resetMatrix();
    fill(0);
    textSize(16);
    text("Controls: 左右矢印キーでカメラ回転、上／下矢印キーで前後移動、Spaceで上昇、Xで下降", 10, 30);
}