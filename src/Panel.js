const _ = require('lodash');
const almostEqual = require('almost-equal');
const Entity = require('./Entity');
const Util = require('./util.js');
const uuid = require('uuid/v4');
const Point = require('./Point');

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
    static _buildGraph(panels, panel, checkpoints, connectionMetadata, parent, sorting) {
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
        panel.connections.map(e => e.panel)
            .forEach(e => {
                // build children
                let r = Panel._buildGraph(panels, e, checkpoints, connectionMetadata, current, sorting);
                if(r) {
                    current.children.push(r);
                }
            });

        return current;
    }

    // build graph procedurally from metadata
    static buildGraph(panels, rootIndex, metadata) {
        let { connections, panels: {sorting} }  = metadata;
        let root = panels[rootIndex];
        return Panel._buildGraph(panels, root, [], connections, null, sorting);
    }

    // sort panels by rules
    static sort(panels, {method, args}) {
        let ps = panels.slice();

        // sort by bounding box border points
        // if(method === 'border') {
        //     let segments = panels.reduce((sum, e) => sum.concat(e.outer), []);
        //     let bbox = Util.bbox(segments);
        //     let width = bbox.maxX - bbox.minX;
        //     let height = bbox.maxY - bbox.minY;
        //     let borderPoint = new Point(bbox.minX + width * args[0], bbox.minY + height * args[1]);
            
        //     ps.sort((a,b) => a.centroid().distance2(borderPoint) - b.centroid().distance2(borderPoint));
        // } 
        if(true) {
            let sorted = [];
            let root = ps.filter(p => p.isRoot)[0];
            let stack = [root];

            if(!root) {
                throw new Error('root is not found');
            }

            while(stack.length > 0) {
                let r = stack.pop();
                let pivot = r.centroid();
                sorted.push(r);
                
                // get all unexplored children
                let children = r.connections
                    .filter(e => sorted.indexOf(e.panel) < 0)
                    .map(e => ({
                        centroid: e.panel.centroid(),
                        panel: e.panel
                    }));

                // sort by angle
                children.sort((a,b) => Math.atan2(a.centroid.y - pivot.y, a.centroid.x - pivot.x) - Math.atan2(b.centroid.y - pivot.y, b.centroid.x - pivot.x));

                // add to stack
                children.forEach(e => stack.push(e.panel));
            }

            if(sorted.length !== ps.length) {
                console.log(sorted.length, sorted);
                console.log(ps.length, ps);
                throw new Error('sorted preroot somehow do not have same length as full array');
            }

            ps = sorted;
        }
        else {
            throw new Error('panel sorting method "' + method + '" not found');
        }
        return ps;
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
                sorting: {
                    method: 'preroot'
                },
                data: panels.map(e => ({}))    
            },
            connections: Panel.getConnections(panels)
        };
    }

    centroid() {
        return Util.centroid(this.outer);
    }
 
    equals(p) {
        return this.hash === p.hash;
    }
}

module.exports = Panel;