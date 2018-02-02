const _ = require('lodash');


// find entity by id
function findById(id, arr){
    if(id) {
        for(let i=0; i < arr.length; i++) {
            let e = arr[i];
            if(e.id === id) {
                return e;
            }
        }
    }
    throw new Error('cannot find id', id);
};
function createFindById(arr) {
    return function(id) {
        return findById(id, arr);
    };
};

// turn entity into id
function getId(entity) {
    return entity.id;
}

// traverse tree
function traverse(obj, cb) {
    cb(obj);
    for(let i =0; i < obj.children.length; i++) {
        let r = obj.children[i];
        traverse(r);
    }
}

/**
 * Handle each entity differently
 * it will callback to fn for each sub-entities--- used for serial/deserial
 * @param {*Object} obj any Entity 
 * @param {*Function} fn callback for each entity to be serial/deserial 
 */
function handleEntity(obj, fn) {
    let className = obj.className;
    // let key = [];

    if(className === 'Line') {
        obj.a = fn(obj.a);
        obj.b = fn(obj.b);
    }
    if(className === 'Arc') {
        obj.a = fn(obj.a);
        obj.b = fn(obj.b);
        obj.center = fn(obj.center);
    }
    if(className === 'Graph') {
        traverse(obj, o => o.data = fn(o.data));
    }
    if(className === 'Panel') {
        obj.outer = obj.outer.map(e => fn(e));
        obj.inner = obj.inner.map(e => fn(e));
    }
    return obj;
}

// Turn ids into entities
function deferenceEntity(obj, entities) {
    let find = createFindById(entities);
    return handleEntity(obj, find);
}
// Turn entities into ids
function referenceEntity(obj) {
    return handleEntity(obj, getId);
}

const pson = {
    // write class to json
    write(obj) {
    },  
    read(obj) {
        let p = new this.Pson()
        
        return p.read(obj);
        // if(_.isString(obj)) {
        //     obj = JSON.parse(obj);
        // }
        
        // let newObj = {};
        // let entities = obj['entities'].map(e => this.Entity.createEntityFromData(e));

        // // link pson array to entities
        // _.forOwn(obj, (k, v) => {
        //     if(_.isArray(v)) {
        //         newObj[k] = v.map(e => deferenceEntity(e, entities));
        //     } else {
        //         newObj[k] = v;
        //     }
        // });
        // return newObj;
    },
    findById(id, entities) {
        return findById(id, entities);
    },
    createFindById(entities) {
        return createFindById(entities);
    },

    Entity: require('./src/Entity'),
    Point: require('./src/Point'),
    Line: require('./src/Line'),
    Arc: require('./src/Arc'),
    Panel: require('./src/Panel'),
    Pson: require('./src/Pson'),
    
    test: {
        sample1: require('./test/sample1.json'),
        sample2: require('./test/sample2.json')
    }
};

module.exports = pson;