var pson = require('./index.js');
var _ = require('lodash');
var fs = require('fs');

let r = new pson.Pson();

let p = [
    new pson.Point(0,0),
    new pson.Point(100,0)
];

r.cut = [
    new pson.Line(p[0], p[1])
];

r.crease = [
]

let a = new pson.Panel([], []);
let b = new pson.Panel([], []);

a.connections = [b];
b.connections = [a];
r.panels = [a,b]
// console.log('test', a instanceof pson.Entity);
let str = r.write();

// next.read(str);
// let foo = next.write();

// let n = fs.readFileSync('./test/test.slvs', {encoding: 'ascii'});

// console.log(pson.readSlvs(n));
// let a = new pson.Arc (new pson.Point(0,0), new pson.Point(100,0), new pson.Point(50, 0), 50);
// let b = new pson.Line(new pson.Point(0, -20), new pson.Point(100, -20));

// console.log(a.intersect(b));

// let m = pson.read(pson.test[2]);

fs.writeFileSync('./test/pack.json', r.write());
r.read(str);
fs.writeFileSync('./test/pack2.json', r.write());
