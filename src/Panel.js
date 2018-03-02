const _ = require('lodash');
const Entity = require('./Entity');
const Util = require('./util.js');
const uuid = require('uuid/v4');

class Panel extends Entity {
    constructor(outer, inner, metadata, hash=uuid(), connections=[]) {
        super('Panel');
        this.outer = outer;
        this.inner = inner;
        this.hash = hash;
        this.metadata = metadata;
        this.connections = connections // panels connected to this panel
    }

    addConnection(panel) {
        if(!_.includes(this.connections, panel)) {
            this.connections.push(panel);
        } 
    }

    buildGraph(root={}, checkpoints=[]) {
        if(_.includes(checkpoints, this.hash)) {
            return null;
        }
        checkpoints.push(this.hash);
        root.current = this;
        root.children = [];

        this.connections.forEach(e => {
            let r = e.buildGraph(o, checkpoints);
            if(r) {
                root.children.push(r);
            }
        });

        return root;
    }
 
    equals(p) {
        return this.hash === p.hash;
    }
}

module.exports = Panel;