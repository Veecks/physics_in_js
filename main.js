var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var friction = 2;
var g = 1;
var objects = [];
var clickX = 0;
var clickY = 0;
var beingDragged = null;
var sq;
var sq2;
var floor;
var lastUpdate;
var deltaTime = 0;
function tick() {
    var now = Date.now();
    deltaTime = (now - lastUpdate) / 10;
    update();
    lastUpdate = now;
}
var Object2D = /** @class */ (function () {
    function Object2D(x, y, size_x, size_y) {
        this.obj = document.createElement('div');
        this.obj.style.position = 'absolute';
        this.obj.style.width = "".concat(size_x, "px");
        this.obj.style.height = "".concat(size_y, "px");
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
    Object.defineProperty(Object2D.prototype, "size_x", {
        get: function () { return parseFloat(this.obj.style.width.slice(0, -2)); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Object2D.prototype, "size_y", {
        get: function () { return parseFloat(this.obj.style.height.slice(0, -2)); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Object2D.prototype, "x", {
        get: function () { return parseFloat(this.obj.style.left.slice(0, -2)); },
        set: function (x) {
            this.prev_x = this.x;
            this.obj.style.left = "".concat(x, "px");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Object2D.prototype, "y", {
        get: function () { return parseFloat(this.obj.style.top.slice(0, -2)); },
        set: function (y) {
            this.prev_y = this.y;
            this.obj.style.top = "".concat(y, "px");
        },
        enumerable: false,
        configurable: true
    });
    Object2D.prototype.doPhysics = function () {
    };
    Object2D.prototype.rigidbody = function () {
        this.velX -= friction / this.mass * this.velX * deltaTime;
        this.velY += (g - friction / this.mass * this.velY) * deltaTime;
        if (Math.abs(this.velX) < 0.05)
            this.velX = 0;
        this.x += this.velX * deltaTime;
        this.y += this.velY * deltaTime;
    };
    Object2D.prototype.collider = function (entity) {
        var colided = false;
        if (this.x < entity.x + entity.size_x &&
            this.x + this.size_x > entity.x &&
            this.y < entity.y + entity.size_y &&
            this.y + this.size_y > entity.y) {
            // this.obj.style.background = 'blue';
            if (this.x + this.size_x >= entity.x && this.x + this.size_x <= entity.x + entity.size_x) {
                if (this.prev_x + this.size_x <= entity.x) {
                    colided = true;
                    this.velX = -(this.bounce * Math.abs(this.velX) + (1 - entity.bounce) * Math.abs(entity.velX));
                    entity.velX = (entity.bounce * Math.abs(entity.velX) + (1 - this.bounce) * Math.abs(this.velX));
                }
            }
            else if (this.x <= entity.x + entity.size_x && this.x + this.size_x >= entity.x + entity.size_x) {
                if (this.prev_x >= entity.x + entity.size_x) {
                    colided = true;
                    this.velX = (this.bounce * Math.abs(this.velX) + (1 - entity.bounce) * Math.abs(entity.velX));
                    entity.velX = -(entity.bounce * Math.abs(entity.velX) + (1 - this.bounce) * Math.abs(this.velX));
                }
            }
            if (this.y + this.size_y >= entity.y && this.y + this.size_y <= entity.y + entity.size_y) {
                if (this.prev_y + this.size_y <= entity.y) {
                    colided = true;
                    this.y = entity.y - this.size_y + 1;
                    this.velY = -Math.abs(this.velY);
                    entity.velY = Math.abs(entity.velY);
                }
            }
            else if (this.y <= entity.y + entity.size_y && this.y + this.size_y >= entity.y + entity.size_y) {
                if (this.prev_y >= entity.y + entity.size_y) {
                    colided = true;
                    entity.y = this.y - entity.size_y + 1;
                    this.velY = Math.abs(this.velY);
                    entity.velY = -Math.abs(entity.velY);
                }
            }
            // if(colided == false) {
            //     if(this.y + this.size_y - 10 < entity.y)
            //         this.y = entity.y - this.size_y;
            //     if(this.y > entity.y + entity.size_y - 10)
            //         entity.y = this.y - entity.size_y;
            // }
        }
        else {
            this.obj.style.background = '#ddaa10';
        }
    };
    return Object2D;
}());
var Box = /** @class */ (function (_super) {
    __extends(Box, _super);
    function Box(x, y, size_x, size_y, color) {
        if (color === void 0) { color = '#ffffff'; }
        var _this = _super.call(this, x, y, size_x, size_y) || this;
        _this.obj.classList.add('box', 'box-collider');
        _this.obj.style.background = color;
        return _this;
    }
    return Box;
}(Object2D));
var Square = /** @class */ (function (_super) {
    __extends(Square, _super);
    function Square(x, y, size, color) {
        if (color === void 0) { color = '#ffffff'; }
        var _this = _super.call(this, x, y, size, size) || this;
        _this.obj.classList.add('square', 'box-collider', 'rigidbody');
        _this.obj.style.background = color;
        _this.prev_x;
        _this.prev_y;
        _this.dragging = 0;
        _this.obj.onmousedown = _this.onClickHandler.bind(_this);
        _this.obj.ontouchstart = _this.onClickHandler.bind(_this);
        document.addEventListener('mousemove', _this.mouseDrag.bind(_this));
        document.addEventListener('touchmove', _this.touchDrag.bind(_this));
        _this.obj.onmouseup = function () { return _this.dragging = false; };
        _this.obj.ontouchend = function () { return _this.dragging = false; };
        return _this;
    }
    Square.prototype.onClickHandler = function (e) {
        e.preventDefault();
        clickX = e.clientX;
        clickY = e.clientY;
        this.dragging = true;
    };
    Square.prototype.mouseDrag = function (e) {
        e.preventDefault();
        if (this.dragging) {
            this.x += e.clientX - clickX;
            this.y += e.clientY - clickY;
            clickX = e.clientX;
            clickY = e.clientY;
        }
    };
    Square.prototype.touchDrag = function (e) {
        e.preventDefault();
        if (this.dragging) {
            this.x += e.touches[0].clientX - clickX;
            this.y += e.touches[0].clientY - clickY;
            clickX = e.touches[0].clientX;
            clickY = e.touches[0].clientY;
        }
    };
    Square.prototype.rigidbody = function () {
        if (!this.dragging) {
            _super.prototype.rigidbody.call(this);
        }
        else {
            this.velY = 0.15 * (this.y - this.prev_y) / deltaTime;
            this.velX = 0.15 * (this.x - this.prev_x) / deltaTime;
        }
    };
    return Square;
}(Object2D));
function collide() {
    // floor
    if (sq.y + sq.size_y > floor.y) {
        sq.y = floor.y - 100;
        if (sq.velY > 0)
            sq.velY *= -sq.bounce;
    }
    if (sq2.y + sq2.size_y > floor.y) {
        sq2.y = floor.y - sq2.size_y;
        if (sq2.velY > 0)
            sq2.velY *= -sq2.bounce;
    }
    //walls
    if (sq.x <= 0) {
        sq.dragging = false;
        if (sq.velX < 0)
            sq.velX *= -sq.bounce;
    }
    else if (sq.x >= window.innerWidth - sq.size_x) {
        sq.dragging = false;
        if (sq.velX > 0) {
            sq.velX *= -sq.bounce;
        }
    }
    if (sq2.x <= 0) {
        sq2.dragging = false;
        if (sq2.velX < 0)
            sq2.velX *= -sq2.bounce;
    }
    else if (sq2.x >= window.innerWidth - sq2.size_x) {
        sq2.dragging = false;
        if (sq2.velX > 0) {
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
    floor.obj.innerText = "VelX = ".concat(sq.velX, "\n");
    floor.obj.innerText += "VelY = ".concat(sq.velY, "\n");
}
start();
