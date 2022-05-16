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
    constructor(x, y, size_x, size_y) {
        this.obj = document.createElement('div');
        this.obj.style.position = 'absolute'
        this.x = x;
        this.y = y;
        this.obj.style.width = `${size_x}px`;
        this.obj.style.height = `${size_y}px`;
        document.body.appendChild(this.obj);
    }
    get size_x() { return parseFloat(this.obj.style.width.slice(0, -2)) }
    get size_y() { return parseFloat(this.obj.style.height.slice(0, -2)) }
    get x() { return parseFloat(this.obj.style.left.slice(0, -2)) }
    set x(x) { this.obj.style.left = `${x}px`; }
    get y() { return parseFloat(this.obj.style.top.slice(0, -2)) }
    set y(y) {this.obj.style.top = `${y}px`;}
    get pos() {return [this.x, this.y]}
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
    velX: Number;
    velY: Number;
    prev_x: Number;
    prev_y: Number;
    constructor(x, y, size, color = '#ffffff') {
        super(x, y, size, size);
        this.obj.classList.add('square', 'box-collider', 'rigidbody');
        this.obj.style.background = color;
        this.velX = 0;
        this.velY = 0;
        this.prev_x;
        this.prev_y;
        this.obj.onclick = sqrClickHandler;
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
        sq.y = floor.y - 100;
        if(sq.velY > 0) {
            sq.velY = -(sq.velY) * 0.6 + 1;
        }
    }
    if(sq.x <= 0 || sq.x >= window.innerWidth - sq.size_x ) {
        sq.velX *= -1;
    }
}


function start() {
    sq = new Square(100, 100, 100);
    floor = new Box(0, window.innerHeight - 200, screen.width, 200);
    sq.velX = 10;
    lastUpdate = Date.now();
    setInterval(tick, 0);
}

function update() {
    console.log(deltaTime);
    if(!isDown) {
        sq.velY += 0.5 * deltaTime;
        sq.y += sq.velY * deltaTime;
        sq.x += sq.velX * deltaTime;
        sq.velX -= 0.007 * sq.velX;
    }else {
        sq.velY = 0.15 * (sq.y - sq.prev_y) / deltaTime;
        sq.velX = 0.15 * (sq.x - sq.prev_x) / deltaTime;
    }
    collide();
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

start();