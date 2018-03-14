const _ = require('lodash');
const almostEqual = require('almost-equal');
const Entity = require('./Entity');
const Util = require('./util.js');
const uuid = require('uuid/v4');

class Panel extends Entity {
    constructor(outer, inner, meta={}, hash=uuid(), connections=[]) {
        super('Panel');
        this.outer = outer;
        this.inner = inner;
        this.hash = hash;
        this.meta = meta;
        this.connections = connections // panels connected to this panel
    }

    addConnection(panel, checkSegments=true) {
        let c = _.find(this.connections, c => c.panel.hash === panel.hash);
        if(c) {
            return true;
        } else {
            let segments = _.intersectionWith(this.outer, panel.outer, (a, b) => a.equals(b));
            if(segments.length > 0) {
                this.connections.push({panel, segments}); 
                return true;       
            }
        }
        return false;
    }

    // use lmtm algorithm
    buildGraph(root={}, checkpoints=[]) {
        if(_.includes(checkpoints, this.hash)) {
            return null;
        }
        checkpoints.push(this.hash);
        root.current = this;
        root.children = [];

        let pivot = Util.midpoint(root.current.outer);

        this.connections = Panel.applyLmtm(this.connections, item => Util.midpoint(item.panel.outer, pivot));
        this.connections.forEach(e => {
            let r = e.panel.buildGraph({}, checkpoints);
            if(r) {
                root.children.push(r);
            }
        });

        return root;
    }

    // sort panels by lmtm rule
    static applyLmtm(panels, transformFn) {
        return panels.slice()
            .map( e => ({ ...transformFn(e), data: e }) ) // get midpoint or whatever
            .sort( (a, b) => { //lmtm sorting
                if(a.x < b.x) {
                    return -1;
                } else if(a.x > b.x) {
                    return 1;
                } else if(almostEqual(a.x, b.x, 0.0001)) {
                    if(a.y > b.y) {
                        return -1;
                    } else if(a.y < b.y) {
                        return 1;
                    }
                }
                return 0;
            })
            .map( ({ data }) => data );
    }
 
    equals(p) {
        return this.hash === p.hash;
    }
}

module.exports = Panel;