
window.addEventListener('load', start);
const frameTime = 100000 / 60;
let deltaTime = 0;
let lastTimestamp = 0;

let sq;
let floor;

class Object2D {
    obj: HTMLElement
    constructor(x, y) {
        this.obj = document.createElement('div');
        this.obj.style.position = 'absolute'
        this.x = x;
        this.y = y;
        document.body.appendChild(this.obj);
    }

    get x() { return parseFloat(this.obj.style.left.slice(0, -2)) }
    set x(x) { this.obj.style.left = `${x}px`; }
    get y() { return parseFloat(this.obj.style.top.slice(0, -2)) }
    set y(y) {this.obj.style.top = `${y}px`;}
    get pos() {return [this.x, this.y]}
}

class Box extends Object2D{
    constructor(x, y, size_x, size_y, color = '#ffffff') {
        super(x, y);
        this.obj.classList.add('box', 'box-collider');
        this.obj.style.width = `${size_x}px`;
        this.obj.style.height = `${size_y}px`;
        this.obj.style.background = color;
    }
}

class Square extends Object2D{
    vel: Number;
    constructor(x, y, size, color = '#ffffff') {
        super(x, y);
        this.obj.classList.add('square', 'box-collider', 'rigidbody');
        this.obj.style.height = `${size}px`;
        this.obj.style.width = `${size}px`;
        this.obj.style.background = color;
        this.vel = 0;
    }
}


function collide() {
    if(sq.y + 100 > floor.y) {
        sq.y = floor.y - 100;
        if(sq.vel > 0) {
            sq.vel *= -0.7;
        }
    }
}

function start() {
    sq = new Square(100, 100, 100);
    floor = new Box(0, window.innerHeight - 200, screen.width, 200);
    requestAnimationFrame(update);
}

function update(timestamp) {
    requestAnimationFrame(update) ;
    deltaTime = (timestamp  - lastTimestamp) / frameTime;
    sq.vel += 0.5 * deltaTime;
    sq.y += sq.vel * deltaTime;
    collide()
    
}

let isDown = false;
document.addEventListener('click', () => isDown = !isDown);