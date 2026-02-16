const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
const title = document.getElementById("newYearText");

/* ================= CANVAS ================= */
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* ================= NỀN TRỜI ================= */
function drawSky() {
    const g = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height,
        0,
        canvas.width / 2,
        canvas.height,
        canvas.height
    );

    g.addColorStop(0, "#1c2f5a");
    g.addColorStop(0.5, "#0b1030");
    g.addColorStop(1, "#02010a");

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/* ================= SAO RƠI ================= */
class Star {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.r = Math.random() * 1.6 + 0.4;
        this.speed = Math.random() * 0.3 + 0.05;
        this.a = Math.random() * 0.6 + 0.4;
    }
    update() {
        this.y += this.speed;
        if (this.y > canvas.height) this.reset();

        ctx.fillStyle = `rgba(255,255,255,${this.a})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }
}
const stars = Array.from({ length: 220 }, () => new Star());

/* ================= SAO BĂNG ================= */
class Meteor {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = -200;
        this.y = Math.random() * canvas.height * 0.3;
        this.v = 6 + Math.random() * 4;
    }
    update() {
        const hue = (this.x / canvas.width) * 360;

        ctx.save();
        ctx.strokeStyle = `hsla(${hue},100%,80%,0.9)`;
        ctx.lineWidth = 2;
        ctx.shadowColor = `hsl(${hue},100%,80%)`;
        ctx.shadowBlur = 15;

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - 160, this.y + 55);
        ctx.stroke();
        ctx.restore();

        this.x += this.v;
        this.y += this.v * 0.45;

        /* chữ đổi màu theo sao băng */
        if (title) {
            title.style.color = `hsl(${hue},70%,75%)`;
            title.style.textShadow = `
                0 0 20px hsla(${hue},100%,80%,0.6),
                0 0 45px hsla(${hue},100%,60%,0.4)
            `;
        }

        if (this.x > canvas.width + 300) this.reset();
    }
}
const meteors = Array.from({ length: 3 }, () => new Meteor());

/* ================= PHÁO HOA (RÕ HƠN) ================= */
class Firework {
    constructor(x, y) {
        this.particles = [];
        this.split = false;

        const count = 160; // 🔥 nhiều tia hơn
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 4;

            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 140,
                size: Math.random() * 2.5 + 1.8,
                hue: Math.random() * 360
            });
        }
    }

    update() {
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.025;
            p.life--;

            ctx.save();
            ctx.globalAlpha = p.life / 140;
            ctx.shadowBlur = 25;
            ctx.shadowColor = `hsl(${p.hue},100%,65%)`;
            ctx.fillStyle = `hsl(${p.hue},100%,65%)`;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        /* nổ tầng 2 cho đã mắt */
        if (this.particles.length < 40 && !this.split) {
            this.split = true;
            this.particles.forEach(p => {
                for (let i = 0; i < 3; i++) {
                    this.particles.push({
                        x: p.x,
                        y: p.y,
                        vx: (Math.random() - 0.5) * 3,
                        vy: (Math.random() - 0.5) * 3,
                        life: 60,
                        size: 1.3,
                        hue: p.hue
                    });
                }
            });
        }

        this.particles = this.particles.filter(p => p.life > 0);
    }
}

const fireworks = [];
setInterval(() => {
    fireworks.push(
        new Firework(
            Math.random() * canvas.width,
            Math.random() * canvas.height * 0.55
        )
    );
}, 1100);

/* ================= LOOP ================= */
function animate() {
    ctx.fillStyle = "rgba(3, 2, 15, 0.22)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawSky();
    stars.forEach(s => s.update());
    meteors.forEach(m => m.update());
    fireworks.forEach(f => f.update());

    requestAnimationFrame(animate);
}
animate();

/* ================= LÌ XÌ ================= */
function nhanLiXi() {
    document.getElementById("troll").style.display = "block";
    const music = document.getElementById("bgMusic");
    if (music) {
        music.volume = 0.6;
        music.currentTime = 0;
        music.play().catch(() => {});
    }
}
