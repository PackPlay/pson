const pson = require('./index.js');

let a = new pson.Point(200, 200);
let b = new pson.Point(400, 400);

let p = new pson.Point(300, 300);
let p2 = new pson.Point(105, 105);


let line = new pson.Line(a,b);


console.log(line.contains(p))
console.log(line.contains(p2))