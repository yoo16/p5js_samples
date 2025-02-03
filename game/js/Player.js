class Player {
    constructor() {
        this.pos = createVector(-800, -playerSize, 0);
        this.size = playerSize;
        this.velocity = createVector(0, 0, 0);
        this.grounded = false;
        this.speed = 1;
        this.jumpSpeed = 22;
    }

    update() {
        this.handleMovement();
        this.handleGroundAndJump();
        this.applyGravity();
        
        // 水平方向は個別に解決
        this.resolveHorizontalCollision();
        // 垂直方向も個別に解決
        this.resolveVerticalCollision();
        
        // 摩擦処理などは各軸の速度に対して行う
        this.velocity.mult(0.9);
    }

    // カメラの向きに応じた前後移動
    handleMovement() {
        let direction = createVector(
            sin(radians(camAngle)), // X成分
            0,
            cos(radians(camAngle))  // Z成分
        );
        if (keyIsDown(UP_ARROW)) {
            this.velocity.add(p5.Vector.mult(direction, this.speed));
        }
        if (keyIsDown(DOWN_ARROW)) {
            this.velocity.add(p5.Vector.mult(direction, -this.speed));
        }
    }

    handleGroundAndJump() {
        const jumpSpeed = this.jumpSpeed;
        const groundThreshold = -1;
        if (this.pos.y >= groundThreshold) {
            this.pos.y = 0;
            this.velocity.y = 0;
            this.grounded = true;
            if (keyIsDown(32)) { // Spaceでジャンプ
                this.velocity.y = -jumpSpeed;
                this.grounded = false;
            }
        } else {
            this.grounded = false;
            if (keyIsDown(88)) { // Xで強制下降
                this.velocity.y = jumpSpeed;
            }
        }
    }

    applyGravity() {
        const gravity = 0.5;
        this.velocity.y += gravity;
    }

    // 垂直方向の移動と衝突処理（Y軸のみ）
    resolveVerticalCollision() {
        let newY = this.pos.y + this.velocity.y;
        let verticalTestPos = createVector(this.pos.x, newY, this.pos.z);
        let verticalCollision = false;
        let collidedObstacle = null;

        for (let obs of obstacles) {
            if (sphereBoxCollision(verticalTestPos, this.size / 2, obs)) {
                verticalCollision = true;
                collidedObstacle = obs;
                break;
            }
        }

        if (!verticalCollision) {
            this.pos.y = newY;
        } else {
            // 障害物に衝突した場合、障害物の上にプレイヤーを配置
            if (collidedObstacle) {
                // 障害物の表示上の頂点（Y座標）は、translate()時の補正と合わせる必要がある
                let topY = -(collidedObstacle.pos.y + collidedObstacle.h / 2 - 1);
                this.pos.y = topY + this.size / 2;
            }
            this.velocity.y = 0;
            this.grounded = true;
        }
    }

    // 水平方向の移動と衝突処理（X, Z軸）
    resolveHorizontalCollision() {
        // X軸個別処理
        let newX = this.pos.x + this.velocity.x;
        let testPosX = createVector(newX, this.pos.y, this.pos.z);
        let collisionX = false;
        for (let obs of obstacles) {
            if (sphereBoxCollision(testPosX, this.size / 2, obs)) {
                collisionX = true;
                break;
            }
        }
        if (!collisionX) {
            this.pos.x = newX;
        } else {
            this.velocity.x = 0;
        }

        // Z軸個別処理
        let newZ = this.pos.z + this.velocity.z;
        let testPosZ = createVector(this.pos.x, this.pos.y, newZ);
        let collisionZ = false;
        for (let obs of obstacles) {
            if (sphereBoxCollision(testPosZ, this.size / 2, obs)) {
                collisionZ = true;
                break;
            }
        }
        if (!collisionZ) {
            this.pos.z = newZ;
        } else {
            this.velocity.z = 0;
        }
    }

    display() {
        push();
        translate(this.pos.x, this.pos.y, this.pos.z);
        rotateY(radians(camAngle));
        fill(100, 100, 200);
        noStroke();
        sphere(this.size / 2);
        pop();
    }
}