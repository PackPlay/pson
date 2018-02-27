const _ = require('lodash');
const uuid = require('uuid/v4');
const intersect = require('svg-intersections').intersect;
const roundTo = require('round-to');

class Entity {
    constructor(className, id) {
        this.id = id;
        this.className = className || 'Entity';
        // this.baseName = 'Entity';
    }

    isClass(entity) {
        return this.className === entity.className;
    }

    generateId() {
        this.id = uuid();
    }

    equals(entity) {
        return this.isClass(entity) && this.id && entity.id && this.id === entity.id;
    }

    // inherit method
    intersect(entity) {
        let result = intersect(this.shape, entity.shape);
        result.points = result.points.map(p => ({
            x: roundTo(p.x, 4),
            y: roundTo(p.y, 4)
        }));
        // console.log(result);
        result = this.postIntersect(result);
        result = entity.postIntersect(result);
        
        return result;
    }

    // post processing intersection
    postIntersect(result) {
        return result;
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