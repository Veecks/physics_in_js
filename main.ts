const friction = 2;
const g = 0.5;
let sq;
let floor;
let lastUpdate;
let deltaTime = 0;
function tick() {
    let now = Date.now();
    deltaTime = (now - lastUpdate) / 10;
    update();
    lastUpdate = now;
}


class Object2D {
    obj: HTMLElement
    mass: number
    velX: number
    velY: number
    constructor(x, y, size_x, size_y) {
        this.obj = document.createElement('div');
        this.obj.style.position = 'absolute'
        this.obj.style.width = `${size_x}px`;
        this.obj.style.height = `${size_y}px`;
        document.body.appendChild(this.obj);

        this.x = x;
        this.y = y;
        this.velX = 0;
        this.velY = 0;
        this.mass = 100;
        this.bounce = 0.8;
    }

    get size_x() { return parseFloat(this.obj.style.width.slice(0, -2)) }
    get size_y() { return parseFloat(this.obj.style.height.slice(0, -2)) }
    get x() { return parseFloat(this.obj.style.left.slice(0, -2)) }
    set x(x) { this.obj.style.left = `${x}px`; }
    get y() { return parseFloat(this.obj.style.top.slice(0, -2)) }
    set y(y) {this.obj.style.top = `${y}px`;}
    
    rigidbody() {
        this.velX -= friction / this.mass * this.velX * deltaTime;
        this.velY += (g - friction / this.mass * this.velY) * deltaTime;
        this.x += this.velX * deltaTime;
        this.y += this.velY * deltaTime;
    }

    collider() {

    }
}

class Box extends Object2D{
    constructor(x, y, size_x, size_y, color = '#ffffff') {
        super(x, y, size_x, size_y);
        this.obj.classList.add('box', 'box-collider');
        this.obj.style.background = color;
    }
}
let isDown = false;
class Square extends Object2D{
    prev_x: Number;
    prev_y: Number;
    constructor(x, y, size, color = '#ffffff') {
        super(x, y, size, size);
        this.obj.classList.add('square', 'box-collider', 'rigidbody');
        this.obj.style.background = color;
        this.prev_x;
        this.prev_y;
        this.obj.onmousedown = sqrClickHandler;
    }

    get x() { return parseFloat(this.obj.style.left.slice(0, -2)) }
    set x(x) { 
        this.prev_x = this.x;
        this.obj.style.left = `${x}px`; 
    }
    get y() { return parseFloat(this.obj.style.top.slice(0, -2)) }
    set y(y) {
        this.prev_y = this.y;
        this.obj.style.top = `${y}px`;
    }

}
let clickX = 0;
let clickY = 0;
function sqrClickHandler(e: MouseEvent) {
    clickX = e.clientX;
    clickY = e.clientY;
    isDown = !isDown;
}

function collide() {
    if(sq.y + 100 > floor.y) {
        isDown = false;
        sq.y = floor.y - 100;
        if(sq.velY > 0)
            sq.velY *= -sq.bounce;
    }
    if(sq.x <= 0) {
        isDown = false;
        if(sq.velX < 0)
            sq.velX *= -sq.bounce;
    }else if(sq.x >= window.innerWidth - sq.size_x) {
        isDown = false;
        if(sq.velX > 0) {
            sq.velX *= -sq.bounce;
        }
    }
}


function start() {
    sq = new Square(100, 100, 100, '#ddaa10');
    floor = new Box(0, window.innerHeight - 200, screen.width, 200);
    lastUpdate = Date.now();
    setInterval(tick, 0);
}

function update() {
    console.log(deltaTime);
    if(!isDown) {
        sq.rigidbody();
    }else {
        sq.velY = 0.15 * (sq.y - sq.prev_y) / deltaTime;
        sq.velX = 0.15 * (sq.x - sq.prev_x) / deltaTime;
    }
    collide();
    (floor.obj as HTMLElement).innerText = `VelX = ${sq.velX}\n`;
    (floor.obj as HTMLElement).innerText += `VelY = ${sq.velY}\n`;
}

// document.addEventListener('click', () => isDown = !isDown);
document.addEventListener('mousemove', (e) => {
    if(isDown) {
        sq.x += e.clientX - clickX;
        sq.y += e.clientY - clickY;
        clickX = e.clientX;
        clickY = e.clientY;
    }
});
document.addEventListener('touchmove', (e) => {
    if(isDown) {
        sq.x += e.touches[0].clientX - clickX;
        sq.y += e.touches[0].clientY - clickY;
        clickX = e.touches[0].clientX;
        clickY = e.touches[0].clientY;
    }
});

start();