const almostEqual = require('almost-equal');
const shape = require('svg-intersections');
const Entity = require('./Entity');
const Point = require('./Point');

class Arc {
    /**
     * 
     * @param {*Point} a 
     * @param {*Point} b 
     * @param {*Point} center 
     * @param {*Number} radius 
     */
    constructor(a, b, center, radius) {
        this.a = a;
        this.b = b;
        this.center = center;
        this.radius = radius;
        this.shape = shape('arc', {
            d: [
                ['M', a.x, a.y].join(' '),
                ['A', center.x, center.y, 0, 0, 0, b.x, b.y].join(' ')
            ].join(' ')
        });
    }

    contains(point) {
        let minX = this.a.x < this.b.x ? this.a.x : this.b.x;
        let minY = this.a.y < this.b.y ? this.a.y : this.b.y;
        let maxX = this.a.x > this.b.x ? this.a.x : this.b.x;
        let maxY = this.a.y > this.b.y ? this.a.y : this.b.y;

        if(almostEqual(this.radius, Point.distance(this.center, point), almostEqual.FLT_EPSILON, almostEqual.FLT_EPSILON)) {
            return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY;
        } else {
            return false;
        }
    }
}

module.exports = Arc;