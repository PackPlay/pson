const Entity = require('./Entity');

class Line extends Entity {
    constructor(a,b) {
        super('Line');
        this.a = a;
        this.b = b;
    }
}

module.exports = Line;