var pson = require('./index.js');
var _ = require('lodash');
var fs = require('fs');

let r = new pson.Pson();

let p = [
    new pson.Point(0,0),
    new pson.Point(100,0),
    new pson.Point(100,100),
    new pson.Point(0,100)
];

r.cut = [
    new pson.Line(p[0], p[1]),
    new pson.Line(p[1], p[2]),
    new pson.Line(p[2], p[3]),
    new pson.Line(p[0], p[3])
];

r.crease = [
    new pson.Line(p[0], p[3])
]


fs.writeFileSync('./test/sample1.json', JSON.stringify(r.write(), null, 4));
