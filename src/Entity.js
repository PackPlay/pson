const uuid = require('uuid/v4');

class Entity {
    constructor(className, id) {
        this.id = id || uuid();
        this.className = className || 'Entity';
    }
}

module.exports = Entity;