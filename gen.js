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
    new pson.Arc (p[2+4], p[0+4], new pson.Point(50, 50))
];

r.crease = [
    new pson.Line(p[8], p[9])
]

let n = fs.readFileSync('./test/test.slvs', {encoding: 'ascii'});

console.log(pson.readSlvs(n));
// let a = new pson.Arc (new pson.Point(0,0), new pson.Point(100,0), new pson.Point(50, 0), 50);
// let b = new pson.Line(new pson.Point(0, -20), new pson.Point(100, -20));

// console.log(a.intersect(b));

// let m = pson.read(pson.test[2]);

// fs.writeFileSync('./test/sample3.json', JSON.stringify(r.write(), null, 4));
