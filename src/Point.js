const Entity = require('./Entity');

class Point extends Entity{
    static distance(a, b) {
        return Math.sqrt(Math.pow(a.x-b.x, 2) + Math.pow(a.y-b.y, 2));
    }
    static distance2(a,b) {
        return Math.pow(a.x-b.x, 2) + Math.pow(a.y-b.y, 2);
    }
    constructor(x, y) {
        super('Point');
        this.x = x;
        this.y = y;
    }
    distance(b) {
        return Point.distance(this, b);
    }
}


module.exports = Point;