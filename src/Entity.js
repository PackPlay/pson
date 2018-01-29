const _ = require('lodash');
const uuid = require('uuid/v4');
const intersect = require('svg-intersections').intersect;

class Entity {
    constructor(className, id) {
        this.id = id || uuid();
        this.className = className || 'Entity';
    }

    isClass(entity) {
        return this.entity.className === entity.className;
    }

    equals(entity) {
        return this.id && entity.id && this.id === entity.id;
    }

    // inherit method
    intersect(entity) {
        return intersect(this.shape, entity.shape);
    }

    clone() {
        return new Entity(className);
    }

    interpolate() {
        return this;
    }

    toJSON() {
        return _.omit(this, ['shape']);
    }
}

module.exports = Entity;