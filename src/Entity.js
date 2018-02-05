const _ = require('lodash');
const uuid = require('uuid/v4');
const intersect = require('svg-intersections').intersect;
const roundTo = require('round-to');

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
        let result = intersect(this.shape, entity.shape);
        result.points = result.points.map(p => ({
            x: roundTo(p.x, 6),
            y: roundTo(p.y, 6)
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