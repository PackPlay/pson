const uuid = require('uuid/v4');
const intersect = require('svg-intersections').intersect;
const Line = require('./Line');
const Point = require('./Point');
const Arc = require('./Arc');

class Entity {
    /**
     * create derived entity class from object;
     * @param {*Object} object json
     */
    static createEntityFromData(object, options) {
        let className = object.className;
        let o = null;
        if(className === 'Point') {
            o = new Point(object.x, object.y);
        } else if(className === 'Arc') {
            o = new Arc(object.a, object.b, object.center, object.radius);
        } else if(className === 'Line') {
            o = new Line(object.a, object.b);
        } else {
            throw new Error('Unknown entity type ' + JSON.stringify(object));
        }

        if(!options.newId) {
            o.id = object.id;
        }
        return o;
    }

    equals(entity) {
        return this.id === entity.id;
    }
    // inherit method
    intersect(entity) {
        intersect(this.shape, entity.shape);
    }

    clone() {
        return Entity.createEntityFromData(this, {newId: true});
    }
    
    constructor(className, id) {
        this.id = id || uuid();
        this.className = className || 'Entity';
    }
}

module.exports = Entity;