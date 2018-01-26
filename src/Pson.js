const _ = require('lodash');
const deepMap = require('deep-map');
const Entity = require('./Entity');
const Line = require('./Line');
const Point = require('./Point');
const Arc = require('./Arc');

function index(obj, is, value) {
    if (typeof is == 'string')
        return index(obj,is.split('.'), value);
    else if (is.length==1 && value!==undefined)
        return obj[is[0]] = value;
    else if (is.length==0)
        return obj;
    else
        return index(obj[is[0]],is.slice(1), value);
}

class Pson {
    constructor(json) {
        this.cut = [];
        this.crease = [];
        this.bone = [];
        this.metadata = {};
        this.panels = [];

        if(json) {
            this.read(json);
        }
    }

    /**
     * Return json
     */
    write() {
        return JSON.parse(JSON.stringify(this));
    }
    /**
     * Read to Container
     * @param {*String|Object} json 
     */
    read(json) {
        if(_.isString(json)) {
            json = JSON.parse(json);
        }
        
        deepMap(json, v => {
            return (v instanceof Entity) ? Pson.createEntityFromData(v) : v; 
        });

        _.forOwn(this, (v, k) => {
            this[k] = json[k] || v;
        });

        return this;
    }
    
    finalize() {
        // let entities = [];
        // Container.traverse(this, (entity) => {
        //     this.createEntityFromData(entity, { entities });
        // });
    }
    /**
     * create derived entity class from object;
     * @param {*Object} object json
     */
    static createEntityFromData(object, options) {
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
    // static traverse(object, cb, path='') {
    //     // graph
    //     if(_.isArray(object)) {
    //         _.forEach(object, o => Pson.traverse(o, cb, `${path}[${i}]`));
    //     } 
    //     else if(_.isObject(object)) {
    //         _.forOwn(object, (v, k) => Pson.traverse(o, cb, `${path}.${k}`));

    //         if(object instanceof Entity || object.className) {
    //             cb(object, path);
    //         }
    //     }
    // }
}

module.exports = Pson;