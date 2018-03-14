const _ = require('lodash');
const Point = require('./Point');
let md5 = require('md5');

class Util {
    static hash(o) {
        return md5(o);
    }
    static midpoint(segments, pivot) {
        let all = _.flatten(segments.map(e => e.interpolate(5).slice(0, -1)));
        
        let s = _.reduce(all, (sum, n) => {
            sum.x += n.x / all.length;
            sum.y += n.y / all.length; 
            return sum;
        }, new Point(0,0));

        if(pivot) {
            s.x -= pivot.x;
            s.y -= pivot.y;
        }
        return new Point(s.x, s.y);
    }
}

module.exports = Util;