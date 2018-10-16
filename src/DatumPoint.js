const Point = require('./Point');

class DatumPoint extends Point{
    constructor(x, y, data) {
        super(x,y);
        this.className = 'DatumPoint';
        this.data = data;
    }
}


module.exports = DatumPoint;