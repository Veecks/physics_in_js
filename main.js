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
window.addEventListener('load', start);
var frameTime = 100000 / 60;
var deltaTime = 0;
var lastTimestamp = 0;
var sq;
var floor;
var Object2D = /** @class */ (function () {
    function Object2D(x, y) {
        this.obj = document.createElement('div');
        this.obj.style.position = 'absolute';
        this.x = x;
        this.y = y;
        document.body.appendChild(this.obj);
    }
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
    Object.defineProperty(Object2D.prototype, "pos", {
        get: function () { return [this.x, this.y]; },
        enumerable: false,
        configurable: true
    });
    return Object2D;
}());
var Box = /** @class */ (function (_super) {
    __extends(Box, _super);
    function Box(x, y, size_x, size_y, color) {
        if (color === void 0) { color = '#ffffff'; }
        var _this = _super.call(this, x, y) || this;
        _this.obj.classList.add('box', 'box-collider');
        _this.obj.style.width = "".concat(size_x, "px");
        _this.obj.style.height = "".concat(size_y, "px");
        _this.obj.style.background = color;
        return _this;
    }
    return Box;
}(Object2D));
var Square = /** @class */ (function (_super) {
    __extends(Square, _super);
    function Square(x, y, size, color) {
        if (color === void 0) { color = '#ffffff'; }
        var _this = _super.call(this, x, y) || this;
        _this.obj.classList.add('square', 'box-collider', 'rigidbody');
        _this.obj.style.height = "".concat(size, "px");
        _this.obj.style.width = "".concat(size, "px");
        _this.obj.style.background = color;
        _this.vel = 0;
        return _this;
    }
    return Square;
}(Object2D));
function collide() {
    if (sq.y + 100 > floor.y) {
        sq.y = floor.y - 100;
        if (sq.vel > 0) {
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
    requestAnimationFrame(update);
    deltaTime = (timestamp - lastTimestamp) / frameTime;
    sq.vel += 0.5 * deltaTime;
    sq.y += sq.vel * deltaTime;
    collide();
}
var isDown = false;
document.addEventListener('click', function () { return isDown = !isDown; });
