const _ = require('lodash');
const deepMap = require('deep-map');
const Entity = require('./Entity');
const Panel = require('./Panel');
const Line = require('./Line');
const Point = require('./Point');
const DatumPoint = require('./DatumPoint');
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
        this.group = {};
        this.metadata = {};
        this.panels = [];
        this.data = [];

        if(json) {
            this.read(json);
        }
    }

    reset() {
        this.cut = [];
        this.crease = [];
        this.bone = [];
        this.group = {};
        this.metadata = {};
        this.panels = [];
        this.entities = [];
        this.data = [];
    }

    /**
     * Return json
     */
    write(pack=true) {
        //compacting data
        let r = '';
        if(pack) {
            this.packEntities();
            r = JSON.stringify(this);
            this.unpackEntities(); //pack entity mutilate the obj, so we're reverting
        } else {
            r = JSON.stringify(this); //risk circular json problem
        }
        return r;
    }
    /**
     * Read to Container
     * @param {*String|Object} json 
     */
    read(json, unpack=true, options={}) {
        this.reset();
        if(_.isString(json)) {
            json = JSON.parse(json);
        }
        // force non-unpack on no entities detected
        if(!json.entities) {
            unpack = false;
        }

        // fast copy
        _.forOwn(this, (v, k) => {
            this[k] = json[k] || v;
        });

        // unpack entities to objects
        if(unpack) {
            this.unpackEntities(options);
        } else {
            this.data = [];
            _.forOwn(this, (v, k) => {
                this[k] = Pson.map(v, e => {
                    let r = Pson.createEntityFromData(e, options.entity)
                    if(r.className === 'DatumPoint') {
                        console.log('found');
                        this.data.push(r);
                    }
                    return r;
                });
            });

            this.data = _.uniqWith(this.data, (a,b) => a.equals(b));
        }

        // pruning out Point in segments
        _.forOwn(this, (v, k) => {
            if(k !== 'entities' && k !== 'data' && _.isArray(v)) {
                // console.log('pruning', v);
                this[k] = _.filter(v, e => e.className !== 'Point' && e.className !== 'DatumPoint'); //quickfix: prune out Points 
            }
        });

        console.log('rdata', this.data);
        console.log('read');
        return this;
    }

    // insert uniquely to entities
    insertToEntities(entity) {
        if(!(entity instanceof Entity)) {
            // console.log('test', entity.className);
            return entity;
        }
        let e = this.findInEntities(entity);
        if(e) {
            return e;
        } else {
            // insert
            this.entities.push(entity);
            return entity;
        }
    }
    findInEntities(entity) {
        // console.log(entity);
        for(let i = 0; i < this.entities.length; i++) {
            if(this.entities[i].isClass(entity) && this.entities[i].equals(entity)) {
                return this.entities[i];
            }
        }    
        return null;
    }
    getEntityById(id) {
        return _.find(this.entities, r => r.id === id) || id;
    }
    // pack all entities into ids
    // regenerate their ids accordingly
    packEntities() {
        this.entities = [];
        // console.log(this);

        _.forOwn(this, (v,k) => {
            if(k !== 'entities') {
                // console.log(k, v);
                this[k] = Pson.map(v, e => this.insertToEntities(e));
            }
        });

        _.forEach(this.entities, (e, i) => {
            e.id = e.className+'-'+i;
        });
        this.entities = _.map(this.entities, e => Pson.map(e, (c, path) => {
            if(path === '') {
                return c; 
            } else {
                return c.id;
            }
        }));
        
        _.forOwn(this, (v,k) => {
            if(k !== 'entities') {
                this[k] = Pson.map(v, e => e.id);
            }
        });
        // console.log('entities', this.entities);
    }
    unpackEntities(options={}) {
        this.entities = _.map(this.entities, e => {
            if(e.className === 'Point' || e.className === 'DatumPoint')
                return Pson.createEntityFromData(e, options.entity);
            return e;
        });
        let atomic = this.entities.filter(e => e instanceof Entity);

        // console.log('atom', atomic);
        this.entities = Pson.mapNotObject(this.entities, (r, path) => {
            if(!path.endsWith('.id')) {
                return _.find(atomic, a => a.id === r) || r;
            }
            return r;
        });
        this.entities = _.map(this.entities, e => Pson.createEntityFromData(e, options.entity));
        this.entities = Pson.mapNotObject(this.entities, (r, path) => {
            if(!path.endsWith('.id'))
                return this.getEntityById(r);
            return r;
        });

        // console.log(this.entities)
        _.forOwn(this, (v, k) => {
            if(k !== 'entities') {
                if(_.isArray(v)) {
                    this[k] = v.map(e => this.getEntityById(e));
                } else if(!_.isObject(v)){
                    this[k] = this.getEntityById(v);
                } else if(v.children) { // is graph
                    this[k] = Pson.mapNotObject(v, (r, path) => {
                        if(!path.endsWith('.id'))
                            return this.getEntityById(r);
                        return r;
                    });
                } else {
                    this[k] = Pson.mapNotObject(v, (r, path) => {
                        if(!path.endsWith('.id'))
                            return this.getEntityById(r);
                        return r;
                    });
                }
            }
        });
    }
    removeDuplicate() {
        this.cut = _.uniqWith(this.cut, (a,b) => a.equals(b));
        this.crease = _.uniqWith(this.crease, (a,b) => a.equals(b));
    }

    static createEntityFromData(object, options={}) {
        // preexisting entity container
        if(object instanceof Entity) {
            return object;
        }
        let className = object.className;
        let o = null;

        if(className === 'Point') {
            o = new Point(object.x, object.y);
        } else if(className === 'DatumPoint') {
            o = new DatumPoint(object.x, object.y, object.data);
            console.log('datum', o)
        } else if(className === 'Arc') {
            o = new Arc(object.a, object.b, object.center, object.radius, object.ccw);
        } else if(className === 'Line') {
            o = new Line(object.a, object.b);
        } else if(className === 'Panel') {
            o = new Panel(object.outer, object.inner, object.hash, object.connections);
        } else {
            throw new Error('Unknown entity type ' + JSON.stringify(object));
        }

        if(!options.newId) {
            o.id = object.id;
        }
        return o;
    }
    static map(object, cb, path='', tree=[]) {
        // prevent recursion
            // console.log(tree.length);
        if(_.findIndex(tree, e => e === object) >= 0) {
            return object;
        }
        tree = tree.slice();
        tree.push(object);

        if(_.isArray(object)) {
            return _.map(object, (o, i) => Pson.map(o, cb, `${path}[${i}]`, tree));
        } 
        else if(_.isObject(object) || _.isPlainObject(object)) {
            _.forOwn(object, (v,k) => {
                // console.log('o', object[k]);
                try {
                    object[k] = Pson.map(v, cb,`${path}.${k}`, tree);
                } catch(e) {

                }
            });
            if(object.className) {
                return cb(object, path);
            }
        }
        return object;
    }

    static mapNotObject(object, cb, path='', tree=[]) {
        // prevent recursion
        if(_.findIndex(tree, e => e === object) >= 0) {
            return object;
        }
        tree = tree.slice();
        tree.push(object);

        if(_.isArray(object) && !_.isPlainObject(object)) {
            return _.map(object, (o, i) => Pson.mapNotObject(o, cb, `${path}[${i}]`, tree));
        } 
        else if(_.isObject(object) || _.isPlainObject(object)) {
            _.forOwn(object, (v,k) => {
                try {
                    object[k] = Pson.mapNotObject(v, cb,`${path}.${k}`, tree);
                } catch(e) {

                }
            });
        } else {
            return cb(object, path);
        }
        return object;
    }
}

module.exports = Pson;