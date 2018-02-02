var pson = require('./index.js');
var _ = require('lodash');
var fs = require('fs');

let r = new pson.Pson();

let p = [
    new pson.Point(0,0),
    new pson.Point(100,0),
    new pson.Point(100,100),
    new pson.Point(0,100),

    new pson.Point(30,30),
    new pson.Point(100-30,30),
    new pson.Point(100-30,100-30),
    new pson.Point(30,100-30),

    new pson.Point(40,0),
    new pson.Point(100-40,100)
];

r.cut = [
    new pson.Line(p[0], p[1]),
    new pson.Line(p[1], p[2]),
    new pson.Line(p[2], p[3]),
    new pson.Line(p[0], p[3]),
    
    new pson.Line(p[0+4], p[1+4]),
    new pson.Line(p[1+4], p[2+4]),
    new pson.Arc (p[2+4], p[0+4], new pson.Point(50, 50), 15)
];

r.crease = [
    new pson.Line(p[8], p[9])
]


// let m = pson.read(pson.test[2]);

fs.writeFileSync('./test/sample3.json', JSON.stringify(r.write(), null, 4));
