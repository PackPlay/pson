const almostEqual = require('almost-equal');
const shape = require('svg-intersections').shape;
const Entity = require('./Entity');
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
        let mx = this.b.x - this.a.x;
        let my = this.b.y - this.a.y;
        let alpha = 0;

        if(almostEqual(my,0)) {
            alpha = (point.x - this.a.x) / mx;
        } else {
            alpha = (point.y - this.a.y) / my;
        }

        return alpha >= 0.0 && alpha <= 1.0;
    }

    dissect(point) {
        if(point.equals(this.a) && point.equals(this.b)) {
            return [this];
        }
        
        return [new Line(this.a, point), new Line(point, this.b)];
    }

    clone() {
        return new Line(this.a, this.b);
    }

    equals(l) {
        return this.a.equals(l) && this.b.equals(l);
    }
}

module.exports = Line;