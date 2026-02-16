const canvas = document.getElementById("fireworks") || document.getElementById("bg");
const ctx = canvas.getContext("2d");

/* ================= CANVAS ================= */
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* ================= NỀN TRỜI (KHÔNG ĐEN ĐẶC) ================= */
function drawSky() {
    const grad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height,
        0,
        canvas.width / 2,
        canvas.height,
        canvas.height
    );

    grad.addColorStop(0, "#1b2b4f");
    grad.addColorStop(0.5, "#0b0f2a");
    grad.addColorStop(1, "#05010f");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/* ================= SAO TRỜI RƠI CHẬM ================= */
class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.r = Math.random() * 1.5 + 0.3;
        this.speed = Math.random() * 0.3 + 0.1;
        this.alpha = Math.random() * 0.6 + 0.4;
    }

    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = -5;
            this.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
        ctx.fill();
    }
}

const stars = [];
for (let i = 0; i < 220; i++) stars.push(new Star());

/* ================= SAO BĂNG ================= */
class Meteor {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width * 0.7;
        this.y = Math.random() * canvas.height * 0.3;
        this.vx = 4 + Math.random() * 4;
        this.vy = 4 + Math.random() * 4;
        this.len = 120;
    }

    update() {
        const hue = (this.x / canvas.width) * 360;

        const grad = ctx.createLinearGradient(
            this.x,
            this.y,
            this.x - this.vx * 20,
            this.y - this.vy * 20
        );

        grad.addColorStop(0, `hsl(${hue},100%,80%)`);
        grad.addColorStop(1, "transparent");

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x - this.vx * this.len,
            this.y - this.vy * this.len
        );
        ctx.stroke();

        this.x += this.vx;
        this.y += this.vy;

        if (this.x > canvas.width || this.y > canvas.height) {
            this.reset();
        }

        updateTextColor(hue);
    }
}

const meteors = [];
for (let i = 0; i < 6; i++) meteors.push(new Meteor());

/* ================= CHỮ ĐỔI MÀU THEO SAO BĂNG ================= */
const text = document.getElementById("newYearText");

function updateTextColor(hue) {
    if (!text) return;

    text.style.color = `hsl(${hue}, 80%, 75%)`;
    text.style.textShadow = `
        0 0 18px hsla(${hue},100%,80%,0.7),
        0 0 40px hsla(${hue},100%,60%,0.4)
    `;
}

/* ================= PHÁO HOA ================= */
class Firework {
    constructor(x, y) {
        this.particles = [];
        for (let i = 0; i < 60; i++) {
            const a = Math.random() * Math.PI * 2;
            const s = Math.random() * 4 + 2;
            this.particles.push({
                x, y,
                vx: Math.cos(a) * s,
                vy: Math.sin(a) * s,
                life: 80,
                hue: Math.random() * 360
            });
        }
    }

    update() {
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.02;
            p.life--;

            ctx.fillStyle = `hsla(${p.hue},100%,60%,${p.life / 80})`;
            ctx.fillRect(p.x, p.y, 2.5, 2.5);
        });

        this.particles = this.particles.filter(p => p.life > 0);
    }
}

const fireworks = [];

/* ================= LOOP ================= */
function loop() {
    drawSky();

    stars.forEach(s => s.update());
    meteors.forEach(m => m.update());
    fireworks.forEach(f => f.update());

    requestAnimationFrame(loop);
}
loop();

/* ================= PHÁO HOA TỰ ĐỘNG ================= */
setInterval(() => {
    fireworks.push(
        new Firework(
            Math.random() * canvas.width,
            Math.random() * canvas.height * 0.5
        )
    );
}, 1000);

/* ================= NÚT LÌ XÌ ================= */
function nhanLiXi() {
    document.getElementById("troll").style.display = "block";
    const music = document.getElementById("bgMusic");
    if (music) {
        music.volume = 0.6;
        music.currentTime = 0;
        music.play().catch(() => {});
    }
}
