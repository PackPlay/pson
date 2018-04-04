const almostEqual = require('almost-equal');
const Entity = require('./Entity');
const roundTo = require('round-to');

class Point extends Entity{
    static distance(a, b) {
        return Math.sqrt(Math.pow(a.x-b.x, 2) + Math.pow(a.y-b.y, 2));
    }
    static distance2(a,b) {
        return Math.pow(a.x-b.x, 2) + Math.pow(a.y-b.y, 2);
    }
    constructor(x, y) {
        super('Point');
        this.x = roundTo(x, 6);
        this.y = roundTo(y, 6);
    }
    distance2(b) {
        return Point.distance(this, b);
    }
    distance(b) {
        return Point.distance(this, b);
    }
    subtract(b) {
        return new Point(this.x - b.x, this.y - b.y);
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    add(b) {
        return new Point(this.x + b.x, this.y + b.y);
    }
    multiply(scalar) {
        return new Point(this.x*scalar, this.y*scalar);
    }
    normalize() {
        let l = this.length();
        return new Point(this.x / l, this.y / l);
    }
    dot(b) {
        return this.x * b.x + this.y * b.y;
    }
    is(p) {
        return almostEqual(this.distance(p), 0);
    }
    clone() {
        return new Point(this.x, this.y);
    }
    equals(p) {
        return almostEqual(this.x, p.x, 0.0001) && almostEqual(this.y, p.y, 0.0001);
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
    toArray() {
        return [this.x, this.y];
    }
}


module.exports = Point;