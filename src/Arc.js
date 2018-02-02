const almostEqual = require('almost-equal');
const shape = require('svg-intersections').shape;
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

        let d = [
            ['M', a.x, a.y].join(' '),
            ['A', center.x, center.y, 0, 0, 0, b.x, b.y].join(' ')
        ].join(' ');
        this.shape = shape('arc', { d });
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

    dissect(point) {
        if(point.equals(this.a) || point.equals(this.b)) {
            return [this];
        }

        return [new Arc(this.a, point, this.center, this.radius), 
                new Arc(point, this.b, this.center, this.radius)];
    }

    clone() {
        return new Arc(this.a, this.b, this.center, this.radius);
    }
    equals(arc) {
        return this.a.equals(arc.a) && this.b.equals(arc.b) && this.center.equals(arc.center) && this.radius.equals(arc.radius);
    }

    interpolate(samplingSize=12) {
        let startRad = 2 * Math.atan2(this.a.y - this.center.y, this.a.x - this.center.x + this.radius);
        let endRad = 2 * Math.atan2(this.b.y - this.center.y, this.b.x - this.center.x + this.radius);

        // assume rotate from a to b
        if(startRad > endRad) {
            endRad += 2 * Math.PI;
        }

        let dRad = (endRad - startRad) / samplingSize;
        let points = [];

        for(let i = 0; i < samplingSize; i++) {
            let x = this.center.x + this.radius * Math.cos(dRad * i + startRad);
            let y = this.center.y + this.radius * Math.sin(dRad * i + startRad)
            points.push(new Point(x,y));
        }
        
        return points;
    }
    toString() {
        return (`A(${l.a.x},${l.a.y} -> ${l.b.x},${l.b.y})`);
    }
}

module.exports = Arc;