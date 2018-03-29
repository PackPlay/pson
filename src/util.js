const _ = require('lodash');
const Point = require('./Point');
const {polygon} = require('@turf/helpers');
const centroid = require('@turf/centroid');
let md5 = require('md5');

class Util {
    static arrangeGroup(group) {
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
                throw new Error('tries exceed len^2 of len=' + len);
            }
        }
    
        return arrange;
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
    // refer to wiki
    static centroid(segments, pivot) {
        let all = _.flatten(segments.map((e, i, arr) => i === arr.length-1 ? e.interpolate() : e.interpolate().slice(0, -1)))
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