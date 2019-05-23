const Entity = require('./Entity');

// A virtual segment that actually consists of array of points instead of vector graphics
class PointSegment extends Entity {
    constructor(segment, interpolatedSize) {
        super('ps' + segment.className);
        this.id = 'ps-' + segment.id;
        this.originalClassName = segment.className;
        this.originalId = segment.id;
        this.points = segment.interpolate(interpolatedSize);


        // generate id for interpolated points automatically
        if(segment.a.id && segment.b.id) {
            let id = [segment.a.id, segment.b.id].sort().join('_');

            for(let i = 1; i < this.points.length-1; i++) {
                this.points[i].id = id + '-' + i;
            }
        }
    }

    interpolate() {
        return this.points.slice();
    }

    // just swap points array
    swap() {
        let tmp = this.points.slice();
        this.points = [];

        for(let i = tmp.length-1; i >= 0; i--) {
            this.points.push(tmp[i]);
        }

        return this.points;
    }

    // return endpoints
    get a() {
        return this.points[0];
    }
    get b() {
        return this.points[this.points.length-1];
    }

    toString() {
        return this.points.map(e => e.toString()).join('->');
    }

    toStringId() {
        return this.points.map(e => e.id).join('->');
    }
}

module.exports = PointSegment;