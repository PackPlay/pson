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

    contains(point) {
        return false;
    }

    clone() {
        return new Entity(className);
    }

    // return array of points
    interpolate() {
        return [];
    }

    toJSON() {
        return _.omit(this, ['shape']);
    }

    toString() {
        return `(${id})`;
    }
}

module.exports = Entity;