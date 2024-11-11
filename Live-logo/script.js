// Hamburger Menu Toggle
document.querySelector('.hamburger').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Slider Animation
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    document.querySelector('.slider').style.transform = `translateX(-${currentSlide * 100}vw)`;
}, 3000);

// P5.js Code for Particles (unchanged)

let logoParticles = [];
let img;

function preload() {
    img = loadImage('https://static.vecteezy.com/system/resources/thumbnails/029/724/383/small_2x/simple-logo-featuring-red-fox-free-vector.jpg'); // replace with your logo image
}

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('particle-logo');

    img.loadPixels();

    for (let x = 0; x < img.width; x += 4) {
        for (let y = 0; y < img.height; y += 4) {
            let index = (x + y * img.width) * 4;
            let r = img.pixels[index];
            let g = img.pixels[index + 1];
            let b = img.pixels[index + 2];
            let a = img.pixels[index + 3];
            if (a > 128) {
                logoParticles.push(new Particle(x + (width - img.width) / 2, y + (height - img.height) / 2, color(r, g, b)));
            }
        }
    }
}

function draw() {
    background(0, 0, 0);

    for (let particle of logoParticles) {
        particle.behaviors();
        particle.update();
        particle.show();
    }
}

class Particle {
    constructor(x, y, col) {
        this.pos = createVector(random(-width, 2 * width), random(-height, 2 * height));
        this.target = createVector(x, y);
        this.vel = p5.Vector.random2D();
        this.acc = createVector();
        this.r = random(2, 5);
        this.maxspeed = 30;
        this.maxforce = 1;
        this.color = col;
    }

    behaviors() {
        let mouse = createVector(mouseX, mouseY);
        let flee = this.flee(mouse);
        let arrive = this.arrive(this.target);

        flee.mult(5);
        arrive.mult(1);

        this.applyForce(flee);
        this.applyForce(arrive);
    }

    applyForce(f) {
        this.acc.add(f);
    }

    update() {
        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.acc.mult(0);
    }

    show() {
        let flicker = map(sin(frameCount * 0.1 + this.pos.x * 0.01), -1, 1, 100, 255);
        let dynamicSize = map(sin(frameCount * 0.1 + this.pos.y * 0.01), -1, 1, this.r - 2, this.r + 2);
        stroke(this.color.levels[0], this.color.levels[1], this.color.levels[2], flicker);
        strokeWeight(dynamicSize);
        point(this.pos.x, this.pos.y);
    }

    arrive(target) {
        let desired = p5.Vector.sub(target, this.pos);
        let d = desired.mag();
        let speed = this.maxspeed;
        if (d < 100) {
            speed = map(d, 0, 100, 0, this.maxspeed);
        }
        desired.setMag(speed);
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxforce);
        return steer;
    }

    flee(target) {
        let desired = p5.Vector.sub(target, this.pos);
        let d = desired.mag();
        if (d < 50) {
            desired.setMag(this.maxspeed);
            desired.mult(-1);
            let steer = p5.Vector.sub(desired, this.vel);
            steer.limit(this.maxforce);
            return steer;
        } else {
            return createVector(0, 0);
        }
    }
}
