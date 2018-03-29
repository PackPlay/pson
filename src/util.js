const _ = require('lodash');
const Point = require('./Point');
let md5 = require('md5');

class Util {
    static hash(o) {
        return md5(o);
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