const _ = require('lodash');
const deepMap = require('deep-map');
const Entity = require('./Entity');
const Line = require('./Line');
const Point = require('./Point');
const Arc = require('./Arc');
const util = require('./util');

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
        return JSON.stringify(this);
    }
    /**
     * Read to Container
     * @param {*String|Object} json 
     */
    read(json) {
        if(_.isString(json)) {
            json = JSON.parse(json);
        }
        
        json = Pson.map(json, v => {
            return Pson.createEntityFromData(v); 
        });

        _.forOwn(this, (v, k) => {
            this[k] = json[k] || v;
        });

        _.forOwn(this, (v, k) => {
            if(k !== 'entities' && _.isArray(v)) {
                this[k] = _.filter(v, e => e.className === 'Point'); //quickfix: prune out Points 
            }
        });

        return this;
    }
    
    finalize() {
        // let entities = [];
        // Container.traverse(this, (entity) => {
        //     this.createEntityFromData(entity, { entities });
        // });
    }

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
            o = new Arc(object.a, object.b, object.center, object.radius, object.ccw);
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

    static map(object, cb, path='') {
        // graph
        if(_.isArray(object)) {
            return _.map(object, (o, i) => Pson.map(o, cb, `${path}[${i}]`));
        } 
        else if(_.isObject(object) || _.isPlainObject(object)) {
            object = _.mapValues(object, (o, k) => Pson.map(o, cb, `${path}.${k}`));
            
            if(object instanceof Entity || object.className) {
                return cb(object, path);
            }
        }
        return object;
    }
}

module.exports = Pson;