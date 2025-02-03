let x, y;             // ボールの位置
let vx = 0, vy = 0;   // ボールの速度
let permissionGranted = false; // センサー利用の許可状態

function setup() {
    createCanvas(windowWidth, windowHeight);
    x = width / 2;
    y = height / 2;

    // iOS 13以降など、デバイスモーションのアクセス許可が必要な場合用のボタンを作成
    let btn = createButton("モーションセンサーを有効にする");
    btn.position(10, 10);
    btn.mousePressed(requestAccess);
}

function requestAccess() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(response => {
                if (response === 'granted') {
                    permissionGranted = true;
                } else {
                    console.log("モーションセンサーの利用が拒否されました。");
                }
            })
            .catch(console.error);
    } else {
        // iOS以外の環境では通常アクセス許可は不要
        permissionGranted = true;
    }
}

function draw() {
    background(220);

    let ax = 0, ay = 0;
    let debugInfo = "";  // デバッグ情報を蓄積する変数

    // センサーが利用可能で、かつ許可が得られている場合
    if (permissionGranted && (typeof accelerationX !== 'undefined')) {
        // 加速度センサーの値（重力成分を含む）を利用
        // 値が大きいため、スケールダウンしています
        ax = accelerationX * 0.1;
        ay = accelerationY * 0.1;

        // センサーからの値をデバッグ情報として追加
        debugInfo += "accelerationX: " + accelerationX.toFixed(2) + "\n";
        debugInfo += "accelerationY: " + accelerationY.toFixed(2) + "\n";
    } else {
        // センサーが使えない環境では、矢印キーによるシミュレーション
        if (keyIsDown(LEFT_ARROW)) {
            ax = -0.5;
        }
        if (keyIsDown(RIGHT_ARROW)) {
            ax = 0.5;
        }
        if (keyIsDown(UP_ARROW)) {
            ay = -0.5;
        }
        if (keyIsDown(DOWN_ARROW)) {
            ay = 0.5;
        }
        debugInfo += "センサー未使用（キーボード入力）\n";
    }

    // 加速度を速度に反映
    vx += ax;
    vy += ay;
    // 摩擦効果
    vx *= 0.98;
    vy *= 0.98;

    // 速度を元に位置を更新
    x += vx;
    y += vy;

    // 画面端で跳ね返る処理
    if (x < 0 || x > width) {
        vx *= -1;
    }
    if (y < 0 || y > height) {
        vy *= -1;
    }
    x = constrain(x, 0, width);
    y = constrain(y, 0, height);

    // ボール（赤い円）の描画
    fill(255, 0, 0);
    noStroke();
    ellipse(x, y, 50, 50);

    // キャンバス上にデバッグ情報を表示
    fill(0);
    textSize(16);
    textAlign(LEFT, TOP);

    // 画面上部にセンサー情報やキーボード入力状況
    text(debugInfo, 10, 50);

    // 画面下部にボールの位置、速度、センサー許可状態などの情報を表示
    let statusText = "x: " + x.toFixed(2) +
        "\ny: " + y.toFixed(2) +
        "\nvx: " + vx.toFixed(2) +
        "\nvy: " + vy.toFixed(2) +
        "\npermissionGranted: " + permissionGranted;
    text(statusText, 10, height - 100);
}

// ブラウザのウィンドウサイズが変更された際にキャンバスサイズを更新
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
