const _ = require('lodash');
const Point = require('./Point');
let md5 = require('md5');

class Util {
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
        let all = _.flatten(segments.map((e,i) => {
            let r = e.interpolate();
            return (i !== segments.length - 1) ? r.slice(0, r.length-1) : r;
        }));
        let a = Util.signedArea(all);
        let x = Util.signedArea(all, (a,b) => a.x + b.x);
        let y = Util.signedArea(all, (a,b) => a.y + b.y);
        return new Point( x / (6*a), y / (6*a) );
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