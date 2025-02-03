class Player {
    constructor() {
        // 初期位置（例として -800, -playerSize, 0）
        this.pos = createVector(-800, -playerSize, 0);
        // サイズ（直径）
        this.size = playerSize;
        // 速度ベクトル
        this.velocity = createVector(0, 0, 0);
        // 地上フラグ
        this.grounded = false;
        // 移動スピード
        this.speed = 5;
        // ジャンプスピード
        this.jumpSpeed = 10;
    }

    update() {
        // その他の処理（カメラ回転、水平移動などは別途）
        this.updateVerticalMovement();
    }

    // 垂直移動全体の処理
    updateVerticalMovement() {
        this.handleGroundAndJump();
        this.applyGravity();
        this.resolveVerticalCollision();
    }

    // 地上判定とジャンプ／強制下降の入力処理
    handleGroundAndJump() {
        const jumpSpeed = this.jumpSpeed;
        const groundThreshold = -1; // 床とみなす許容範囲

        if (this.pos.y >= groundThreshold) {
            // 地上にいるとみなす
            this.pos.y = 0;
            this.velocity.y = 0;
            this.grounded = true;
            // 地上状態ならジャンプ可能（Space キー）
            if (keyIsDown(32)) {
                this.velocity.y = -jumpSpeed;
                this.grounded = false;
            }
        } else {
            // 空中にいる場合
            this.grounded = false;
            if (keyIsDown(88)) { // "X" キーで強制下降
                this.velocity.y = jumpSpeed;
            }
        }
    }

    // 重力の適用処理
    applyGravity() {
        const gravity = 0.5;
        this.velocity.y += gravity;
    }

    // 垂直方向の候補位置の計算と衝突判定、衝突していなければ位置更新
    resolveVerticalCollision() {
        let newY = this.pos.y + this.velocity.y;
        let verticalTestPos = createVector(this.pos.x, newY, this.pos.z);
        let verticalCollision = false;
        for (let obs of obstacles) {
            if (sphereBoxCollision(verticalTestPos, this.size / 2, obs)) {
                verticalCollision = true;
                break;
            }
        }
        if (!verticalCollision) {
            this.pos.y = newY;
        } else {
            // 衝突があった場合は落下速度をリセット
            this.velocity.y = 0;
        }
    }

    display() {
        push();
        translate(this.pos.x, this.pos.y, this.pos.z);
        fill(100, 100, 200);
        noStroke();
        sphere(this.size / 2);
        pop();
    }
}
