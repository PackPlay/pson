const _ = require('lodash');
const almostEqual = require('almost-equal');
const shape = require('svg-intersections').shape;
const Entity = require('./Entity');
const Point = require('./Point');

class Arc extends Entity{
    /**
     * 
     * @param {*Point} a 
     * @param {*Point} b 
     * @param {*Point} center 
     * @param {*Number} radius 
     */
    constructor(a, b, center, radius, ccw=true) {
        super('Arc');
        this.a = a;
        this.b = b;
        this.center = center;
        this.radius = radius;

        this.ccw = ccw;
        this.calculateShape();
    }

    calculateShape() {
        this.radius = this.a.distance(this.center);
        if(!almostEqual(this.radius, this.b.distance(this.center), 0.001)) {
            throw new Error('Length from a to center and b to center are not equaled ' + this.radius + ', ' + this.b.distance(this.center));
        }
        this.shape = shape('circle', { cx: this.center.x, cy: this.center.y, r: this.radius});
    }

    postIntersect(r) {
        if(r.points.length > 0) {
            let t = [];

            // console.log(r.points);
            while(r.points.length > 0) {
                let p = r.points.pop();
                let pt = new Point(p.x, p.y);
                
                if(this.contains(pt)) {
                    t.push(p);
                }
            }
            r.points = t;
        }
        return r;
    }

    contains(point) {
        let d = almostEqual(this.radius, Point.distance(this.center, point), almostEqual.FLT_EPSILON, almostEqual.FLT_EPSILON);
        // console.log(d, this.radius, Point.distance(this.center, point));
        if(!d) {
            return false;
        }

        let a = this.ccw ? this.a : this.b;
        let b = this.ccw ? this.b : this.a;
        let rad = Math.atan2(point.y - this.center.y, point.x - this.center.x);
        let startRad = Math.atan2(a.y - this.center.y, a.x - this.center.x);
        let endRad = Math.atan2(b.y - this.center.y, b.x - this.center.x);

        // console.log('start', (a.y - this.center.y, a.x - this.center.x))
        // console.log('end', (b.y - this.center.y, b.x - this.center.x))

        // console.log(a.toString(), b.toString(), point.toString())
        // console.log(startRad * 180 / Math.PI, endRad * 180 / Math.PI, rad * 180 / Math.PI);
        // assume rotate from a to b
        if(startRad > endRad) {
            endRad += 2 * Math.PI;
        }
        // console.log(startRad * 180 / Math.PI, endRad * 180 / Math.PI, rad * 180 / Math.PI);

        let n0 = (rad >= startRad && rad <= endRad);
        rad += 2 * Math.PI;
        let n1 = (rad >= startRad && rad <= endRad);
        
        return n0 || n1;
    }

    dissect(point) {
        if(point.equals(this.a) || point.equals(this.b)) {
            return [this];
        }

        return [new Arc(this.a, point, this.center, this.radius, this.ccw), 
                new Arc(point, this.b, this.center, this.radius, this.ccw)];
    }

    clone() {
        return new Arc(this.a, this.b, this.center, this.radius, this.ccw);
    }
    equals(arc) {
        return this.isClass(arc) && this.center.equals(arc.center) &&
            (this.ccw === arc.ccw ? (this.a.equals(arc.a) && this.b.equals(arc.b)) : (this.a.equals(arc.b) && this.b.equals(arc.a)));
    }
    swap() {
        let t = this.a;
        this.a = this.b;
        this.b = t;
        this.ccw = !this.ccw;
    }
    interpolate(samplingSize=24) {
        let a = this.ccw ? this.a : this.b;
        let b = this.ccw ? this.b : this.a;
        let startRad = Math.atan2(a.y - this.center.y, a.x - this.center.x);
        let endRad = Math.atan2(b.y - this.center.y, b.x - this.center.x);

        // assume rotate from a to b
        if(startRad > endRad) {
            endRad += 2 * Math.PI;
        }
        
        let dRad = (endRad - startRad) / samplingSize;
        let points = [];
        
        for(let i = 1; i < samplingSize; i++) {
            let x = this.center.x + this.radius * Math.cos(dRad * i + startRad);
            let y = this.center.y + this.radius * Math.sin(dRad * i + startRad)
            points.push(new Point(x,y));
        }
        points.unshift(a);
        points.push(b);
        
        return this.ccw ? points : _.reverse(points);
    }
    toString() {
        return (`A(${this.a.x},${this.a.y} -> ${this.b.x},${this.b.y})`);
    }
}

module.exports = Arc;