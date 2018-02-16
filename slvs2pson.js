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
    Psonifier.prototype.fromSolvespace = function (rawFile) {
        var requests = this.tokenize(rawFile, 'Request');
        var entities = this.tokenize(rawFile, 'Entity');
        var groups = this.tokenize(rawFile, 'Group');
        var params = this.tokenize(rawFile, 'Param');
        //build point map
        var pointMap = {};
        entities.forEach(function (ent) {
            if (ent["Entity.type"] == Psonifier.POINT_IN_2D) {
                //if is 2d point
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
            switch (ent['Entity.type']) {
                case Psonifier.POINT_IN_2D:
                    return __assign({ '_type': 'Point', 'className': 'Point' }, pointMap[ent['Entity.h.v']]);
                case Psonifier.LINE_SEGMENT:
                    return {
                        '_type': 'Line',
                        'className': 'Line',
                        'a': pointMap[ent['Entity.point[0].v']],
                        'b': pointMap[ent['Entity.point[1].v']]
                    };
                case Psonifier.ARC_OF_CIRCLE:
                    return {
                        '_type': 'Arc',
                        'className': 'Arc',
                        'center': pointMap[ent['Entity.point[0].v']],
                        'a': pointMap[ent['Entity.point[1].v']],
                        'b': pointMap[ent['Entity.point[2].v']]
                    };
                default:
                    return null;
            }
        });
        entities = entities.filter(function (e) { return e; });
        console.log(requests, entities, groups, params);
        return { cut: entities };
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
c.fromSolvespace(file.toString());
// export default new Psonifier()
module.exports = new Psonifier();
