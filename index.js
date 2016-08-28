const shell = require('shelljs');
const multilineToJsonArray = require('./lib/multiline-to-json-array');


function execute(command) {
    return new Promise((resolve, reject) => {
        shell.exec(command, { silent: true }, (code, stdout, stderr) => {
            if (code) {
                return reject(stderr.trim());
            }
            resolve(stdout.trim());
        });
    });
}


function status() {
    return execute('nmcli -m multiline connection status')
        .then(multilineToJsonArray)
        .then(networks => networks.find(network => network.default === 'yes'));
}


function scan() {
    return execute('nmcli -m multiline device wifi list')
        .then(multilineToJsonArray)
        .then(networks => {
            return networks.map(network => {
                network.ssid = network.ssid.replace(/^'|'$/g, '')
                return network;
            })
        })
        .then(networks => networks.sort((a, b) => b.signal - a.signal));
}


function network(id) {
    return scan().then(networks => {
        if (typeof id === 'number' && id > 0 &&  id <= networks.length) {
            return networks[id - 1];
        }
        return networks.find(network => network.ssid === id);
    });
}


function connect(ssid, password) {
    let command = `nmcli device wifi connect "${network}"`;
    if (password) {
        command += ` password "${password}"`;
    }
    return execute(command).then(status);
}


exports.status = status;
exports.scan = scan;
exports.network = network;
exports.connect = connect;
