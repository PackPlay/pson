const _ = require('lodash');
const Entity = require('./Entity');

class Panel extends Entity {
    constructor(outer, inner, metadata) {
        super('Panel');
        this.outer = outer;
        this.inner = inner;
        this.metadata = metadata;
    }
    
}

module.exports = Panel;