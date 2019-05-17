const _ = require('lodash');
const Point = require('./Point');
const almostEqual = require('almost-equal');
const {polygon} = require('@turf/helpers');
const centroid = require('@turf/centroid').default;
let md5 = require('md5');
class BoundingBox {
    constructor(minX, maxX, minY, maxY) {
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
    }

    contains(points) {
        if(points instanceof Point) {
            points = [points];
        }

        return points.every(p => (p.x >= minX || almostEqual(p.x, minX))
            && (p.x <= maxX || almostEqual(p.x, maxX)) 
            && (p.y >= minY || almostEqual(p.y, minY))
            && (p.y <= maxY || almostEqual(p.x, maxY)));
    }
}
class Util {
    // arrange segments such that endpoint of nth is connected to startpoint of (n+1)th... etc
    static arrangeGroup(group, ccw) {
        if(group.length <= 1) return group;
        let arrange = []; // orderly array
        let arr = group.slice();
        let len = group.length;
        let n = 0;
        
        arrange.push(arr.shift());
    
        // after
        while(arr.length > 0) {
            let c = arr.pop();
            let first = arrange[0];
            let last = arrange[arrange.length-1];
            
            if(first !== c) {
                if(first.a.equals(c.a)) {
                    c.swap();
                    arrange.unshift(c);
                    continue;
                } 
                else if(first.a.equals(c.b)) {
                    arrange.unshift(c);
                    continue;
                }     
            }
            if(last !== c) {
                if(last.b.equals(c.a)) {
                    arrange.push(c);
                    continue;
                } else if(last.b.equals(c.b)) {
                    c.swap();
                    arrange.push(c);
                    continue;
                }
            }
    
            arr.unshift(c);
            n++;
            
            if(n > len * len) {
                console.log(arr, arrange);
                throw new Error('tries exceed len^2 of len=' + len + ' and no next segment is found. Maybe these segments are not connected');
            }
        }

        if(!_.isUndefined(ccw)) {
            if(!Util.isCCW(arrange)) {
                arrange = Util.reverseGroup(arrange);
            }
        }
    
        return arrange;
    }

    // reverse group of segments orientation (CCW or CW)
    static reverseGroup(group) {
        if(group.length <= 1) return group;
        let arrange = [];

        // reverse order
        for(let i = group.length-1; i >= 0; i--) {
            group[i].swap();
            arrange.push(group[i]);
        }

        return group;
    }

    // convert group of segments to array of points
    static flattenLoop(segments, sampleFn) {
        if(!sampleFn) {
            sampleFn = () => undefined;
        }
        return _.flatten(segments.map((e, i, arr) => i === arr.length-1 ? e.interpolate(sampleFn(e)) : e.interpolate(sampleFn(e)).slice(0, -1)));
    }

    // check if a group of segments are aligned in CCW orientation
    // pivot is optional, use bbox center as default
    static isCCW(loop, pivot) {
        if(!pivot) {
            pivot = Util.bbMidpoint(loop);
        }
        let all = Util.flattenLoop(loop)
            .map(e => e.subtract(pivot));
        let checksum = [];
        // fast check
        for(let i = 0; i < all.length-1; i++) {
            // positive means ccw from i to i+1
            checksum.push(all[i].cross(all[i+1]));
        }

        let ccw = checksum.every(e => e > 0);
        let cw = checksum.every(e => e < 0); //fail check

        if(!ccw && !cw) {
            console.error(checksum);
            throw new Error('CCW check gives unstable result, somehow orientation of the loop is neither CCW nor CW');
        }
        return ccw;
    }
    static hash(o) {
        return md5(o);
    }
    static det(p0, p1) {
        return p0.x * p1.y - p1.x * p0.y;
    }
    static signedArea(points, cb) {
        cb = cb || (() => 1);
        let sum = 0;
        for(let i=0; i < points.length-1; i++) {
            sum += Util.det(points[i], points[i+1]) * cb(points[i], points[i+1]);
        }
        return sum/2;
    }

    // get bounding box midpoint
    static bbMidpoint(segments) {
        let all = Util.flattenLoop(segments);
        let minX = all[0].x;
        let maxX = all[0].x;
        let minY = all[0].y;
        let maxY = all[0].y;

        all.forEach(({x,y}) => {
            if(x < minX) minX = x;
            if(x > maxX) maxX = x;
            if(y < minY) minY = y;
            if(y > maxY) maxY = y;
        });

        return new Point((maxX + minX)/2, (maxY + minY)/2);
    }

    // get bounding box midpoint
    static bbox(segments) {
        let all = Util.flattenLoop(segments);
        let minX = all[0].x;
        let maxX = all[0].x;
        let minY = all[0].y;
        let maxY = all[0].y;

        all.forEach(({x,y}) => {
            if(x < minX) minX = x;
            if(x > maxX) maxX = x;
            if(y < minY) minY = y;
            if(y > maxY) maxY = y;
        });

        return new BoundingBox(minX, maxX, minY, maxY);
    }
    // refer to wiki
    static centroid(segments, pivot) {
        let arranged = Util.arrangeGroup(segments);
        let all = _.flatten(arranged.map((e, i, arr) => i === arr.length-1 ? e.interpolate() : e.interpolate().slice(0, -1)))
            .map(e => [e.x, e.y]);
        let poly = polygon([all]);
        let point = centroid(poly).geometry.coordinates;
        return new Point( point[0], point[1] );
    }
    static midpoint(segments, pivot) {
        let all = _.flatten(segments.map(e => {
            return e.interpolate()
        }));

        all = _.uniqWith(all, (a,b) => a.equals(b));
        
        // average midpoint
        let s = _.reduce(all, (sum, n) => {
            sum.x += n.x;
            sum.y += n.y;
            return sum;
        }, new Point(0,0));

        s.x /= all.length;
        s.y /= all.length;

        // if any pivots
        if(pivot) {
            s.x -= pivot.x;
            s.y -= pivot.y;
        }
        return new Point(s.x, s.y);
    }
}

module.exports = Util;