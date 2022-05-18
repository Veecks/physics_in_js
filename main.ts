const friction = 2;
const g = 1;
const objects = [];
let clickX = 0;
let clickY = 0;
let beingDragged = null;

let sq;
let sq2;
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
    prev_x: number;
    prev_y: number;
    bounce: number
    components: Array<Function>
    constructor(x, y, size_x, size_y) {
        this.obj = document.createElement('div');
        this.obj.style.position = 'absolute'
        this.obj.style.width = `${size_x}px`;
        this.obj.style.height = `${size_y}px`;
        document.body.appendChild(this.obj);

        this.x = x;
        this.y = y;
        this.prev_x = this.x;
        this.prev_y = this.y;
        this.velX = 0;
        this.velY = 0;
        this.mass = 100;
        this.bounce = 0.7;
        this.components = [];
    }

    get size_x() { return parseFloat(this.obj.style.width.slice(0, -2)) }
    get size_y() { return parseFloat(this.obj.style.height.slice(0, -2)) }
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
    
    doPhysics() {
        
    }

    rigidbody() {
        this.velX -= friction / this.mass * this.velX * deltaTime;
        this.velY += (g - friction / this.mass * this.velY) * deltaTime;
        if (Math.abs(this.velX) < 0.05) this.velX = 0;
        this.x += this.velX * deltaTime;
        this.y += this.velY * deltaTime;
    }

    collider(entity: Object2D) {
        let colided = false;
        if (this.x < entity.x + entity.size_x &&
            this.x + this.size_x > entity.x &&
            this.y < entity.y + entity.size_y &&
            this.y + this.size_y > entity.y) {
            // this.obj.style.background = 'blue';
            if(this.x + this.size_x >= entity.x && this.x + this.size_x <= entity.x + entity.size_x) {
                if(this.prev_x + this.size_x <= entity.x) {
                    colided = true;
                    this.velX = - (this.bounce * Math.abs(this.velX) + (1 - entity.bounce) * Math.abs(entity.velX));
                    entity.velX = (entity.bounce * Math.abs(entity.velX) + (1 - this.bounce) * Math.abs(this.velX));
                }
            }
            else if(this.x <= entity.x + entity.size_x && this.x + this.size_x >= entity.x + entity.size_x) {
                if(this.prev_x >= entity.x + entity.size_x) {
                    colided = true;
                    this.velX = (this.bounce * Math.abs(this.velX) + (1 - entity.bounce) * Math.abs(entity.velX));
                    entity.velX = - (entity.bounce * Math.abs(entity.velX) + (1 - this.bounce) * Math.abs(this.velX));
                }
            }
            if(this.y + this.size_y >= entity.y && this.y + this.size_y <= entity.y + entity.size_y) {
                if(this.prev_y + this.size_y <= entity.y) {
                    colided = true;
                    this.y = entity.y - this.size_y + 1;
                    this.velY = - Math.abs(this.velY);
                    entity.velY = Math.abs(entity.velY);
                }
            }
            else if(this.y <= entity.y + entity.size_y && this.y + this.size_y >= entity.y + entity.size_y) {
                if(this.prev_y >= entity.y + entity.size_y) {
                    colided = true;
                    entity.y = this.y - entity.size_y + 1;
                    this.velY = Math.abs(this.velY);
                    entity.velY = - Math.abs(entity.velY);
                }
            }
            // if(colided == false) {
            //     if(this.y + this.size_y - 10 < entity.y)
            //         this.y = entity.y - this.size_y;
            //     if(this.y > entity.y + entity.size_y - 10)
            //         entity.y = this.y - entity.size_y;
            // }

        }else {
            this.obj.style.background = '#ddaa10';
        }
    }
}

class Box extends Object2D{
    constructor(x, y, size_x, size_y, color = '#ffffff') {
        super(x, y, size_x, size_y);
        this.obj.classList.add('box', 'box-collider');
        this.obj.style.background = color;
    }
}

class Square extends Object2D{
    dragging;
    constructor(x, y, size, color = '#ffffff') {
        super(x, y, size, size);
        this.obj.classList.add('square', 'box-collider', 'rigidbody');
        this.obj.style.background = color;
        this.prev_x;
        this.prev_y;
        this.dragging = 0;
        this.obj.onmousedown = this.onClickHandler.bind(this);
        this.obj.ontouchstart = this.onClickHandler.bind(this);
        document.addEventListener('mousemove', this.mouseDrag.bind(this));
        document.addEventListener('touchmove', this.touchDrag.bind(this));
        this.obj.onmouseup = () => this.dragging = false;
        this.obj.ontouchend = () => this.dragging = false;
    }

    onClickHandler(e) {
        e.preventDefault();
        clickX = e.clientX;
        clickY = e.clientY;
        this.dragging = true;
    }

    mouseDrag(e) {
        e.preventDefault();
        if(this.dragging) {
            this.x += e.clientX - clickX;
            this.y += e.clientY - clickY;
            clickX = e.clientX;
            clickY = e.clientY;
        }
    }

    touchDrag(e) {
        e.preventDefault();
        if(this.dragging) {
            this.x += e.touches[0].clientX - clickX;
            this.y += e.touches[0].clientY - clickY;
            clickX = e.touches[0].clientX;
            clickY = e.touches[0].clientY;
        }
    }

    rigidbody() {
        if(!this.dragging) {
            super.rigidbody();
        }else {
            this.velY = 0.15 * (this.y - this.prev_y) / deltaTime;
            this.velX = 0.15 * (this.x - this.prev_x) / deltaTime;
        }
    }

}

function collide() {
    // floor
    if(sq.y + sq.size_y > floor.y) {
        sq.y = floor.y - 100;
        if(sq.velY > 0)
            sq.velY *= -sq.bounce;
    }
    if(sq2.y + sq2.size_y > floor.y) {
        sq2.y = floor.y - sq2.size_y;
        if(sq2.velY > 0)
            sq2.velY *= -sq2.bounce;
    }

    //walls
    if(sq.x <= 0) {
        sq.dragging = false;
        if(sq.velX < 0)
            sq.velX *= -sq.bounce;
    }else if(sq.x >= window.innerWidth - sq.size_x) {
        sq.dragging = false;
        if(sq.velX > 0) {
            sq.velX *= -sq.bounce;
        }
    }
    if(sq2.x <= 0) {
        sq2.dragging = false;
        if(sq2.velX < 0)
            sq2.velX *= -sq2.bounce;
    }else if(sq2.x >= window.innerWidth - sq2.size_x) {
        sq2.dragging = false;
        if(sq2.velX > 0) {
            sq2.velX *= -sq2.bounce;
        }
    }
}


function start() {
    sq = new Square(100, 100, 100, '#ddaa10');
    sq2 = new Square(250, 100, 50, '#ddaa10');
    floor = new Box(0, window.innerHeight - 200, window.innerWidth, 200);
    lastUpdate = Date.now();
    setInterval(tick, 0);
}

function update() {
    // console.log(deltaTime);
    collide();
    sq.collider(floor);
    sq2.collider(floor);
    sq.collider(sq2);
    
    sq.rigidbody();
    sq2.rigidbody();
    (floor.obj as HTMLElement).innerText = `VelX = ${sq.velX}\n`;
    (floor.obj as HTMLElement).innerText += `VelY = ${sq.velY}\n`;
}

start();