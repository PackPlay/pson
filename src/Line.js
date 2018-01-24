const almostEqual = require('almost-equal');
const shape = require('svg-intersections');
const Entity = require('./Entity');

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
}

module.exports = Line;