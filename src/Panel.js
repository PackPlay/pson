const _ = require('lodash');
const almostEqual = require('almost-equal');
const Entity = require('./Entity');
const Util = require('./util.js');
const uuid = require('uuid/v4');

const DEFAULT_CONNECTION_DATA = {
    angle: 1.0
};

class Panel extends Entity {
    constructor(outer, inner, hash=uuid(), connections=[]) {
        super('Panel');
        this.outer = outer;
        this.inner = inner;
        this.hash = hash;
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
    static _buildGraph(panels, panel, checkpoints, connectionMetadata, parent) {
        if(_.includes(checkpoints, panel.hash)) {
            return null;
        }
        checkpoints.push(panel.hash);

        let current = {};
        current.panel = panel;
        current.children = [];

        // assign some connection metadata, if any
        if(parent && connectionMetadata) {
            
            // find the right connection
            let connection = _.find( connectionMetadata, ({ panels: [a, b] }) => 
                (a === panels.indexOf(current.panel) && b === panels.indexOf(parent.panel)) ||
                (b === panels.indexOf(current.panel) && a === panels.indexOf(parent.panel))
            );

            // assign metadata to this 
            if(connection) {
                current.data = _.extend({}, DEFAULT_CONNECTION_DATA, _.omit(connection, ['panels']));
            }
            else {
                throw new Error('Cannot find connection for ' + panels.indexOf(current.panel) + ' ' + panels.indexOf(parent.panel));
            }
        }

        // sort by lmtm rule
        let pivot = Util.centroid(current.panel.outer);
        Panel.applyLmtm(panel.connections, item => Util.centroid(item.panel.outer, pivot))
            .forEach(e => {
                // build children
                let r = Panel._buildGraph(panels, e.panel, checkpoints, connectionMetadata, current);
                if(r) {
                    current.children.push(r);
                }
            });

        return current;
    }

    // build graph procedurally from metadata
    static buildGraph(panels, rootIndex, metadata) {
        let { connections = null }  = metadata;
        let root = panels[rootIndex];
        return Panel._buildGraph(panels, root, [], connections);
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

    static getConnections(panels) {
        let connections = [];
        panels.forEach((panel, i) => {
            panel.connections.forEach((connection) => {
                let j = _.findIndex(panels, ({hash}) => hash === connection.panel.hash);
                
                if(connections.filter(e => e.panels.indexOf(i) >= 0 && e.panels.indexOf(j) >= 0).length <= 0) {
                    // sort by ascend
                    if(i > j) {
                        let k = j;
                        j = i;
                        i = k;
                    }
                    connections.push({
                        panels: [i,j]
                    });
                }
            });
        });

        return connections;
    }
    static getEmptyMetadata(panels) {
        return {
            panels: {
                root: 0,
                method: 'lmtm',
                data: panels.map(e => ({}))    
            },
            connections: Panel.getConnections(panels)
        };
    }

    centroid() {
        return Util.bbMidpoint(this.outer);
    }
 
    equals(p) {
        return this.hash === p.hash;
    }
}

module.exports = Panel;