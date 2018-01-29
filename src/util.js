const Entity = require('./Entity');
const Line = require('./Line');
const Point = require('./Point');
const Arc = require('./Arc');

class Util {
    /**
     * create derived entity class from object;
     * @param {*Object} object json
     */
    static createEntityFromData(object, options={}) {
        // preexisting entity container
        if(options.entities) {
            let e =_.find(entities, o => o.isClass(entity) && o.equals(entity));
            if(e) return e;
        }

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
}

module.exports = Util;