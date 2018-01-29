const _ = require('lodash');
const deepMap = require('deep-map');
const util = require('./Util');

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
        
        json = Pson.map(json, v => {
            return util.createEntityFromData(v); 
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