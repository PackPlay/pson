const _ = require('lodash');
const Entity = require('./Entity');
const Util = require('./util.js');

class Panel extends Entity {
    constructor(outer, inner, metadata) {
        super('Panel');
        this.outer = outer;
        this.inner = inner;
        this.metadata = metadata;
        this.connections = [] // panels connected to this panel
    }
 
    createConnection() {

    }

    equals(p) {
        return this.isClass(p) && Util.hash(JSON.stringify(this)) === Util.hash(JSON.stringify(p));
    }
}

module.exports = Panel;