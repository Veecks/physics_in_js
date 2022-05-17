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
var g = 0.5;
var sq;
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
        this.velX = 0;
        this.velY = 0;
        this.mass = 100;
        this.bounce = 0.8;
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
        set: function (x) { this.obj.style.left = "".concat(x, "px"); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Object2D.prototype, "y", {
        get: function () { return parseFloat(this.obj.style.top.slice(0, -2)); },
        set: function (y) { this.obj.style.top = "".concat(y, "px"); },
        enumerable: false,
        configurable: true
    });
    Object2D.prototype.rigidbody = function () {
        this.velX -= friction / this.mass * this.velX * deltaTime;
        this.velY += (g - friction / this.mass * this.velY) * deltaTime;
        this.x += this.velX * deltaTime;
        this.y += this.velY * deltaTime;
    };
    Object2D.prototype.collider = function () {
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
var isDown = false;
var Square = /** @class */ (function (_super) {
    __extends(Square, _super);
    function Square(x, y, size, color) {
        if (color === void 0) { color = '#ffffff'; }
        var _this = _super.call(this, x, y, size, size) || this;
        _this.obj.classList.add('square', 'box-collider', 'rigidbody');
        _this.obj.style.background = color;
        _this.prev_x;
        _this.prev_y;
        _this.obj.onmousedown = sqrClickHandler;
        return _this;
    }
    Object.defineProperty(Square.prototype, "x", {
        get: function () { return parseFloat(this.obj.style.left.slice(0, -2)); },
        set: function (x) {
            this.prev_x = this.x;
            this.obj.style.left = "".concat(x, "px");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Square.prototype, "y", {
        get: function () { return parseFloat(this.obj.style.top.slice(0, -2)); },
        set: function (y) {
            this.prev_y = this.y;
            this.obj.style.top = "".concat(y, "px");
        },
        enumerable: false,
        configurable: true
    });
    return Square;
}(Object2D));
var clickX = 0;
var clickY = 0;
function sqrClickHandler(e) {
    clickX = e.clientX;
    clickY = e.clientY;
    isDown = !isDown;
}
function collide() {
    if (sq.y + 100 > floor.y) {
        isDown = false;
        sq.y = floor.y - 100;
        if (sq.velY > 0)
            sq.velY *= -sq.bounce;
    }
    if (sq.x <= 0) {
        isDown = false;
        if (sq.velX < 0)
            sq.velX *= -sq.bounce;
    }
    else if (sq.x >= window.innerWidth - sq.size_x) {
        isDown = false;
        if (sq.velX > 0) {
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
    if (!isDown) {
        sq.rigidbody();
    }
    else {
        sq.velY = 0.15 * (sq.y - sq.prev_y) / deltaTime;
        sq.velX = 0.15 * (sq.x - sq.prev_x) / deltaTime;
    }
    collide();
    floor.obj.innerText = "VelX = ".concat(sq.velX, "\n");
    floor.obj.innerText += "VelY = ".concat(sq.velY, "\n");
}
// document.addEventListener('click', () => isDown = !isDown);
document.addEventListener('mousemove', function (e) {
    if (isDown) {
        sq.x += e.clientX - clickX;
        sq.y += e.clientY - clickY;
        clickX = e.clientX;
        clickY = e.clientY;
    }
});
document.addEventListener('touchmove', function (e) {
    if (isDown) {
        sq.x += e.touches[0].clientX - clickX;
        sq.y += e.touches[0].clientY - clickY;
        clickX = e.touches[0].clientX;
        clickY = e.touches[0].clientY;
    }
});
start();
