const camelcase = require('camelcase');


function multilineToArray(multiline) {
    const array = [];
    let json = {};
    multiline.split(/\r?\n/g).forEach(line => {
        if (line) {
            let [key, value] = line.split(/:\s+/);
            key = camelcase(key);

            if (key in json) {
                array.push(json);
                json = {};
            }
            json[key] = value;
        }
    });
    array.push(json);
    return array;
}


module.exports = multilineToArray;
