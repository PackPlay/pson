"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var fs = require("fs");
var md5_hash_1 = require("md5-hash");
var Psonifier = /** @class */ (function () {
    function Psonifier() {
    }
    Psonifier.prototype.getAllPlanes = function (rawFile) {
        rawFile = rawFile.replace(/\n\n/g, ";");
        var cutMatches = rawFile.match(/name=cut\n[^;]*Group.activeWorkplane.v=([A-z0-9]+)/i);
        var creaseMatches = rawFile.match(/name=crease\n[^;]*Group.activeWorkplane.v=([A-z0-9]+)/i);
        if (cutMatches.length == 0 || creaseMatches.length == 0) {
            throw new Error("stop your wrong missing Cut and Crease group");
        }
        return {
            cut: cutMatches[1],
            crease: creaseMatches[1]
        };
    };
    Psonifier.prototype.fromSolvespace = function (rawFile) {
        // let requests = this.tokenize(rawFile, 'Request');
        var entities = this.tokenize(rawFile, 'Entity');
        // let groups = this.tokenize(rawFile, 'Group');
        // let params = this.tokenize(rawFile, 'Param');
        var planeDef = this.getAllPlanes(rawFile);
        //build point map
        var pointMap = {};
        entities.forEach(function (ent) {
            if (ent["Entity.type"] == Psonifier.POINT_IN_2D) {
                //map it
                pointMap[ent['Entity.h.v']] = {
                    'className': 'Point',
                    'x': ent['Entity.actPoint.x'],
                    'y': ent['Entity.actPoint.y'],
                    'spatialHash': md5_hash_1["default"](ent['Entity.actPoint.x'] + "," + ent['Entity.actPoint.y'])
                };
            }
        });
        entities = entities.map(function (ent) {
            var planeName = null;
            if (ent['Entity.workplane.v'] == planeDef.cut) {
                planeName = 'cut';
            }
            else if (ent['Entity.workplane.v'] == planeDef.crease) {
                planeName = 'crease';
            }
            else {
                planeName = 'other';
            }
            switch (ent['Entity.type']) {
                case Psonifier.POINT_IN_2D:
<<<<<<< HEAD
                    return __assign({ '_type': 'Point', 'planeName': planeName }, pointMap[ent['Entity.h.v']]);
                case Psonifier.LINE_SEGMENT:
                    return {
                        '_type': 'Line',
                        'planeName': planeName,
=======
                    return __assign({ '_type': 'Point', 'className': 'Point' }, pointMap[ent['Entity.h.v']]);
                case Psonifier.LINE_SEGMENT:
                    return {
                        '_type': 'Line',
                        'className': 'Line',
>>>>>>> f02652a75b84a79bdd27dd60aca585870199f17f
                        'a': pointMap[ent['Entity.point[0].v']],
                        'b': pointMap[ent['Entity.point[1].v']]
                    };
                case Psonifier.ARC_OF_CIRCLE:
                    return {
                        '_type': 'Arc',
<<<<<<< HEAD
                        'planeName': planeName,
                        'a': pointMap[ent['Entity.point[0].v']],
                        'b': pointMap[ent['Entity.point[1].v']],
                        'center': pointMap[ent['Entity.point[2].v']]
=======
                        'className': 'Arc',
                        'center': pointMap[ent['Entity.point[0].v']],
                        'a': pointMap[ent['Entity.point[1].v']],
                        'b': pointMap[ent['Entity.point[2].v']]
>>>>>>> f02652a75b84a79bdd27dd60aca585870199f17f
                    };
                default:
                    return null;
            }
        });
<<<<<<< HEAD
        entities = entities.filter(function (k) { return k != null; });
        return {
            'entities': entities,
            'cut': entities.filter(function (k) { return k.planeName === 'cut'; }),
            'crease': entities.filter(function (k) { return k.planeName === 'crease'; })
        };
=======
        entities = entities.filter(function (e) { return e; });
        console.log(requests, entities, groups, params);
        return { cut: entities };
>>>>>>> f02652a75b84a79bdd27dd60aca585870199f17f
    };
    Psonifier.prototype.tokenize = function (rawFile, type) {
        var M = [];
        if (!type) {
            type = 'Request';
        }
        rawFile = rawFile.replace(/\n\n/g, ";");
        var commandGroups = rawFile.match(new RegExp(type + "[^;]+(?=;)", "g"));
        commandGroups.forEach(function (command) {
            var commandList = command.split('\n');
            var object = {};
            commandList.forEach(function (command) {
                var commands = command.split("=");
                if (commands.length !== 2) {
                    return;
                }
                object[commands[0]] = commands[1];
            });
            M.push(object);
        });
        return M;
    };
    Psonifier.POINT_IN_3D = "2000";
    Psonifier.POINT_IN_2D = "2001";
    Psonifier.POINT_N_TRANS = "2010";
    Psonifier.POINT_N_ROT_TRANS = "2011";
    Psonifier.POINT_N_COPY = "2012";
    Psonifier.POINT_N_ROT_AA = "2013";
    Psonifier.NORMAL_IN_2D = "3001";
    Psonifier.NORMAL_IN_3D = "3000";
    Psonifier.NORMAL_N_COPY = "3010";
    Psonifier.NORMAL_N_ROT = "3011";
    Psonifier.NORMAL_N_ROT_AA = "3012";
    Psonifier.DISTANCE = "4000";
    Psonifier.DISTANCE_N_COPY = "4001";
    Psonifier.FACE_NORMAL_PT = "5000";
    Psonifier.FACE_XPROD = "5001";
    Psonifier.FACE_N_ROT_TRANS = "5002";
    Psonifier.FACE_N_TRANS = "5003";
    Psonifier.FACE_N_ROT_AA = "5004";
    Psonifier.WORKPLANE = "10000";
    Psonifier.LINE_SEGMENT = "11000";
    Psonifier.CUBIC = "12000";
    Psonifier.CUBIC_PERIODIC = "12001";
    Psonifier.CIRCLE = "13000";
    Psonifier.ARC_OF_CIRCLE = "14000";
    Psonifier.TTF_TEXT = "15000";
    Psonifier.IMAGE = "16000";
    Psonifier.COMMENT = "1000";
    return Psonifier;
}());
var c = new Psonifier();
var file = fs.readFileSync("./test/test.slvs");
<<<<<<< HEAD
var out = c.fromSolvespace(file.toString());
console.log(out);
exports["default"] = new Psonifier();
=======
c.fromSolvespace(file.toString());
// export default new Psonifier()
module.exports = new Psonifier();
>>>>>>> f02652a75b84a79bdd27dd60aca585870199f17f
