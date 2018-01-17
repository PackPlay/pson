const _ = require('lodash');

const findById = (id, obj) => {
    for(let i=0; i < obj['entities'].length; i++) {
        let e = obj['entities'][i];
        if(e.id === id) {
            return e;
        }
    }
    throw new Error('cannot find id', id);
};
const getArrayWithEntity = (arr, obj) => {
    let newArray = [];
    for(let i=0; i<arr.length; i++) {
        newArray.push(findById(arr[i], obj));
    }

    return newArray;
};

const traverse = (obj, cb) => {
    cb(obj);
    for(let i =0; i < obj.children.length; i++) {
        let r = obj.children[i];
        traverse(r);
    }
}
const pson = {
    read(obj) {
        if(_.isString(obj)) {
            obj = JSON.parse(obj);
        }
        
        let newObj = {};
        
        // link graph to entities
        _.forEach(obj['entities'], (k, v) => {
            if(v.className === 'Graph') {
                traverse(v, o => {
                    o.data = findById(o.data);
                });
            }
        });
        
        // link pson array to entities
        _.forOwn(obj, (k, v) => {
            if(k !== 'metadata' || k !== 'entities') {
                newObj[k] = getArrayWithEntity(v, obj);
            } else {
                newObj[k] = v;
            }
        });

        return newObj;
    }
};

module.exports = pson;