import * as fs from 'fs';
import md5 from 'md5-hash'

class Psonifier {
    static POINT_IN_3D: string = "2000"
    static POINT_IN_2D: string = "2001"
    static POINT_N_TRANS: string = "2010"
    static POINT_N_ROT_TRANS: string = "2011"
    static POINT_N_COPY: string = "2012"
    static POINT_N_ROT_AA: string = "2013"

    static NORMAL_IN_2D: string = "3001"
    static NORMAL_IN_3D: string = "3000"
    static NORMAL_N_COPY: string = "3010"
    static NORMAL_N_ROT: string = "3011"
    static NORMAL_N_ROT_AA: string = "3012"

    static DISTANCE: string = "4000"
    static DISTANCE_N_COPY: string = "4001"

    static FACE_NORMAL_PT: string = "5000"
    static FACE_XPROD: string = "5001"
    static FACE_N_ROT_TRANS: string = "5002"
    static FACE_N_TRANS: string = "5003"
    static FACE_N_ROT_AA: string = "5004"

    static WORKPLANE: string = "10000"
    static LINE_SEGMENT: string = "11000"
    static CUBIC: string = "12000"
    static CUBIC_PERIODIC: string = "12001"
    static CIRCLE: string = "13000"
    static ARC_OF_CIRCLE: string = "14000"
    static TTF_TEXT: string = "15000"
    static IMAGE: string = "16000"
    static COMMENT: string = "1000"

    public fromSolvespace(rawFile: string): Object {
        let requests = this.tokenize(rawFile, 'Request');
        let entities = this.tokenize(rawFile, 'Entity');
        let groups = this.tokenize(rawFile, 'Group');
        let params = this.tokenize(rawFile, 'Param');

        //build point map
        let pointMap = {}
        entities.forEach((ent)=>{
            if(ent["Entity.type"] == Psonifier.POINT_IN_2D){
                //if is 2d point
                //map it
                pointMap[ent['Entity.h.v']] = {
                    'className': 'Point',
                    'x': ent['Entity.actPoint.x'],
                    'y': ent['Entity.actPoint.y'],
                    'spatialHash': md5(ent['Entity.actPoint.x']+","+ent['Entity.actPoint.y'])
                }
            }
        });


        entities = entities.map((ent)=>{
            switch(ent['Entity.type']){
                case Psonifier.POINT_IN_2D:
                    return {
                        '_type': 'Point',
                        'className': 'Point',
                        ...pointMap[ent['Entity.h.v']]
                    }
                case Psonifier.LINE_SEGMENT:
                    return {
                        '_type': 'Line',
                        'className': 'Line',
                        'a': pointMap[ent['Entity.point[0].v']],
                        'b': pointMap[ent['Entity.point[1].v']]
                    }
                case Psonifier.ARC_OF_CIRCLE:
                    return {
                        '_type': 'Arc',
                        'className': 'Arc',
                        'center': pointMap[ent['Entity.point[0].v']],
                        'a': pointMap[ent['Entity.point[1].v']],
                        'b': pointMap[ent['Entity.point[2].v']]
                    }
                default: 
                    return null
            }
        });
        entities = entities.filter(e => e);
        console.log(requests, entities, groups, params);

        return { cut: entities };
    }

    private tokenize(rawFile: string, type?: string): Array<Object>{
        var M = [];
        if(!type){
            type = 'Request'
        }
        rawFile = rawFile.replace(/\n\n/g, ";")
        var commandGroups= rawFile.match(new RegExp(type + "[^;]+(?=;)", "g"));
        commandGroups.forEach(function(command){
            let commandList = command.split('\n');
            let object = {};
            commandList.forEach((command)=>{
                let commands = command.split("=")
                if(commands.length !== 2){
                    return;
                }
                object[commands[0]] = commands[1]
            });
            M.push(object);
        });
        return M;
    }
}

let c = new Psonifier();
let file = fs.readFileSync("./test/test.slvs")
c.fromSolvespace(file.toString())


// export default new Psonifier()
module.exports = new Psonifier();