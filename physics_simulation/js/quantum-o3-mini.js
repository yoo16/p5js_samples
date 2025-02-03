let numParticles = 3; // 量子（波）の数
let waves = [];
let time = 0;

// スライダーから取得するパラメータ用変数
let globalSpeed = 1;       // 波の進む速さ（時間の進行倍率）
let amplitudeMultiplier = 20; // 振幅倍率

// DOM 上のスライダーと表示用の span 要素を取得
const speedSlider = document.getElementById("speedSlider");
const ampSlider = document.getElementById("ampSlider");
const speedValue = document.getElementById("speedValue");
const ampValue = document.getElementById("ampValue");

function setup() {
  createCanvas(600, 400);
  // 初期化：各波の位置、波数 k、角周波数 w、初期位相をランダムに設定
  for (let i = 0; i < numParticles; i++) {
    waves.push({
      x: random(width),
      y: height / 2,
      k: random(0.02, 0.05),  // 波数
      w: random(0.02, 0.05),  // 角周波数
      phase: random(TWO_PI)   // 初期位相
    });
  }
}

function draw() {
  background(0);
  stroke(255);
  noFill();

  // スライダーから現在の値を取得して表示を更新
  globalSpeed = parseFloat(speedSlider.value);
  amplitudeMultiplier = parseFloat(ampSlider.value);
  speedValue.innerText = globalSpeed;
  ampValue.innerText = amplitudeMultiplier;

  let step = 5; // 描画解像度（ピクセル間隔）
  for (let x = 0; x < width; x += step) {
    let sumWave = 0;
    // 各波の寄与を合計
    for (let wave of waves) {
      sumWave += sin(wave.k * (x - wave.x) - wave.w * time + wave.phase);
    }
    // 合成波の振幅に振幅倍率を掛けて y 座標を決定
    let y = height / 2 + sumWave * amplitudeMultiplier;
    ellipse(x, y, 3, 3);
  }
  
  // 時間更新：スライダーの値で進む速さを調整
  time += globalSpeed;
}
