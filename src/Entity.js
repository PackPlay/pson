const uuid = require('uuid/v4');
const Line = require('./Line');
const Point = require('./Point');
const Arc = require('./Arc');

class Entity {
    /**
     * create derived entity class from object;
     * @param {*Object} object json
     */
    static createEntityFromData(object) {
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

        o.id = object.id;
        return o;
    }
    constructor(className, id) {
        this.id = id || uuid();
        this.className = className || 'Entity';
    }
}

module.exports = Entity;