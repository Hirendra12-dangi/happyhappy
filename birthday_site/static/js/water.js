const canvas = document.getElementById('waterCanvas');
const ctx = canvas.getContext('2d');

let width, height, cols, rows;
let damping = 0.98;
let current = [];
let previous = [];
let droplets = [];
let res = 5;

function init() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    cols = Math.floor(width / res);
    rows = Math.floor(height / res);

    current = Array.from({ length: cols }, function() { return new Array(rows).fill(0); });
    previous = Array.from({ length: cols }, function() { return new Array(rows).fill(0); });
}

function Droplet(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 4; // Slowed down splash
    this.vy = (Math.random() - 1) * 6;
    this.gravity = 0.2;
    this.alpha = 1.0;
    // Randomly pick between Cyan and Blue for splashes
    this.color = Math.random() > 0.5 ? "0, 255, 255" : "0, 100, 255";
}

function disturb(x, y, force) {
    let i = Math.floor(x / res);
    let j = Math.floor(y / res);
    if (i > 1 && i < cols - 1 && j > 1 && j < rows - 1) {
        previous[i][j] = force;
        for(let k = 0; k < 3; k++) { // Fewer, more deliberate splashes
            droplets.push(new Droplet(x, y));
        }
    }
}

function render() {
    // Slow trails for a "liquid" feel
    ctx.fillStyle = 'rgba(3, 8, 18, 0.15)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 1; i < cols - 1; i++) {
        for (let j = 1; j < rows - 1; j++) {
            current[i][j] = (
                previous[i - 1][j] +
                previous[i + 1][j] +
                previous[i][j - 1] +
                previous[i][j + 1]
            ) / 2 - current[i][j];

            current[i][j] *= damping;

            if (current[i][j] > 1) {
                let val = current[i][j];
                let a = Math.min(val / 150, 0.6);

                // Color Mixing Logic: Waves change color based on intensity
                let r = 0;
                let g = Math.min(val * 2, 255);
                let b = 255;

                ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";

                // Drawing smooth points instead of sharp boxes
                ctx.beginPath();
                ctx.arc(i * res, j * res, res * 0.7, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Splashes logic
    for (let i = droplets.length - 1; i >= 0; i--) {
        let d = droplets[i];
        d.vy += d.gravity;
        d.x += d.vx;
        d.y += d.vy;
        d.alpha -= 0.015; // Slower fade

        if (d.alpha > 0) {
            ctx.fillStyle = "rgba(" + d.color + "," + d.alpha + ")";
            ctx.beginPath();
            ctx.arc(d.x, d.y, 1.5, 0, Math.PI * 2);
            ctx.fill();
        } else {
            droplets.splice(i, 1);
        }
    }

    let temp = previous;
    previous = current;
    current = temp;

    requestAnimationFrame(render);
}

window.addEventListener('mousemove', function(e) {
    disturb(e.clientX, e.clientY, 300); // Reduced force for smoothness
});

window.addEventListener('touchmove', function(e) {
    disturb(e.touches[0].clientX, e.touches[0].clientY, 400);
    e.preventDefault();
}, { passive: false });

window.addEventListener('resize', init);

init();
render();

// At the bottom of your script
const skipBtn = document.getElementById('skip-btn');

// Show the button after 5 seconds (5000ms)
setTimeout(() => {
    skipBtn.classList.add('show');
}, 8000);

const music = document.getElementById('birthday-music');
let musicStarted = false;

function handleInteraction() {
    if (!musicStarted && music) {
        music.play().then(() => {
            musicStarted = true;
            console.log("Music started successfully!");
        }).catch(error => {
            // Still waiting for a 'strong' interaction
            console.log("Waiting for more user interaction to play music...");
        });
    }
}

// Start music when they move the mouse or touch the screen
window.addEventListener('mousedown', handleInteraction);
window.addEventListener('touchstart', handleInteraction);

skipBtn.addEventListener('click', () => {
    // Fade out effect before redirecting
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1.5s ease';

    setTimeout(() => {
        window.location.href = "home";
    }, 1500);
});