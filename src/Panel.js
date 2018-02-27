const _ = require('lodash');
const Entity = require('./Entity');
const Util = require('./util.js');
const uuid = require('uuid/v4');

class Panel extends Entity {
    constructor(outer, inner, metadata, hash=uuid(), connections=[]) {
        super('Panel');
        this.outer = outer;
        this.inner = inner;
        this.hash = hash;
        this.metadata = metadata;
        this.connections = connections // panels connected to this panel
    }
 
    equals(p) {
        return this.hash === p.hash;
    }
}

module.exports = Panel;