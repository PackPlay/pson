const almostEqual = require('almost-equal');
const shape = require('svg-intersections').shape;
const Entity = require('./Entity');
const Point = require('./Point');
const Arc = require('./Arc');

class Line extends Entity {
    constructor(a, b) {
        super('Line');
        this.a = a;
        this.b = b;
        this.shape = shape('line', {
            x1: a.x,
            y1: a.y,
            x2: b.x,
            y2: b.y
        });
    }
    
    contains(point) {
        let ab = this.b.subtract(this.a);
        let ap = point.subtract(this.a);
        let det = ab.x * ap.y - ab.y * ap.x;

        if(almostEqual(det, 0)) {
            let projection = ap.dot(ab) / ab.dot(ab);
            return projection >= 0.0 && projection <= 1.0;
        } else {
            return false;
        }
    }

    dissect(point) {
        if(point.equals(this.a) || point.equals(this.b)) {
            return [this];
        }
        
        return [new Line(this.a, point), new Line(point, this.b)];
    }
    // contains(point) {
    //     return almostEqual(this.a.distance(point) + this.b.distance(point), this.a.distance(this.b));
    // }

    swap() {
        let t = this.a;
        this.a = this.b;
        this.b = t;
    }

    interpolate(sampleSize=2) {
        if(sampleSize < 2) {
            sampleSize = 2;
        }
        let a = this.a;
        let b = this.b;
        let res = [];
        for(let i = 1; i < sampleSize-1; i++) {
            res.push(new Point(
                a.x + (b.x-a.x) * (i / (sampleSize-1)),
                a.y + (b.y-a.y) * (i / (sampleSize-1))
            ));
        }
        res.unshift(this.a);
        res.push(this.b);
        return res;
    }

    clone() {
        return new Line(this.a, this.b);
    }

    equals(l) {
        return this.isClass(l) && 
            ((this.a.equals(l.a) && this.b.equals(l.b)) || 
                (this.a.equals(l.b) && this.b.equals(l.a)));
    }

    toString() {
        return (`L(${this.a.x},${this.a.y} -> ${this.b.x},${this.b.y})`);
    }
}

module.exports = Line;