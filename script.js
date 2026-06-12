let particles = [];
let isLoopingMode = true;
let hasStarted = false;

function setup() {
    // 建立全螢幕畫布
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '1');
    
    // 初始化粒子數量
    let count = min(windowWidth / 10, 120); 
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(random(width), random(height)));
    }

    // 綁定 Landing Page 按鈕點擊事件
    const startBtn = document.getElementById('start-btn');
    const landingPage = document.getElementById('landing-page');
    
    startBtn.addEventListener('click', () => {
        landingPage.classList.add('hide');
        hasStarted = true; // 允許互動
    });
}

function draw() {
    // 使用微透明背景，創造粒子移動的物理拖尾（流體感）
    background(14, 17, 24, 40);

    // 更新並繪製所有粒子
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // 如果開啟連線模式，計算鄰近粒子並連線
        if (isLoopingMode) {
            for (let j = i + 1; j < particles.length; j++) {
                let d = dist(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
                if (d < 120) {
                    let alpha = map(d, 0, 120, 150, 0);
                    stroke(particles[i].color.r, particles[i].color.g, particles[i].color.b, alpha);
                    strokeWeight(1);
                    line(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
                }
            }
        }
    }
}

// 互動 1：滑鼠點擊爆炸新粒子
function mousePressed() {
    if (!hasStarted) return;
    // 在點擊位置產生 8 顆隨機色彩的爆炸粒子
    for (let i = 0; i < 8; i++) {
        let p = new Particle(mouseX, mouseY);
        p.vel = p5.Vector.random2D().mult(random(2, 6)); // 給予較快的初始速度
        particles.push(p);
    }
    
    // 限制總粒子數，避免畫面過卡
    if (particles.length > 300) {
        particles.splice(0, 8);
    }
}

// 互動 2：鍵盤空白鍵切換模式
function keyPressed() {
    if (!hasStarted) return;
    if (key === ' ') {
        isLoopingMode = !isLoopingMode;
    }
}

// 視窗大小改變時重設畫布
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// 粒子類別 (OOD 類別定義)
class Particle {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(random(-1.5, 1.5), random(-1.5, 1.5));
        this.size = random(4, 8);
        
        // 隨機霓虹色系
        let colors = [
            {r: 0, g: 242, b: 255},  // 科技藍
            {r: 255, g: 0, b: 123},  // 螢光粉
            {r: 173, g: 0, b: 255},  // 魅惑紫
            {r: 0, g: 255, b: 136}   // 螢光綠
        ];
        this.color = random(colors);
    }

    update() {
        // 基礎移動
        this.pos.add(this.vel);

        // 滑鼠引力：當滑鼠靠近時，粒子會受到微弱的拉力
        if (hasStarted && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
            let mouse = createVector(mouseX, mouseY);
            let dir = p5.Vector.sub(mouse, this.pos);
            let d = dir.mag();
            if (d < 250) {
                dir.setMag(0.15); // 引力強度
                this.vel.add(dir);
                this.vel.limit(3); // 限制最大速度
            }
        }

        // 邊界碰撞回彈
        if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
        if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
    }

    draw() {
        noStroke();
        fill(this.color.r, this.color.g, this.color.b, 200);
        ellipse(this.pos.x, this.pos.y, this.size);
    }
}