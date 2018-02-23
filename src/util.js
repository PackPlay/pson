let md5 = require('md5');
class Util {
    static hash(o) {
        return md5(o);
    }
}

module.exports = Util;