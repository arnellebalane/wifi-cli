const shell = require('shelljs');
const multilineToJsonArray = require('./lib/multiline-to-json-array');
const log = require('./lib/logger').log;

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
    return execute('nmcli d | grep wifi')
        .then((network) => {
            network = network.split(/\s{2,}/);
            if (network[2] === 'connected') {
                return {name:network[3]};
            }
            return false;
        });
}


function scan() {
    return execute('nmcli -m multiline device wifi list')
        .then(multilineToJsonArray)
        .then(networks => {
            return networks.map(network => {
                network.ssid = network.ssid.replace(/^'|'$/g, '');
                return network;
            });
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
    let command = `nmcli device wifi connect "${ssid}"`;
    if (password) {
        command += ` password "${password}"`;
    }
    return execute(command).then(status);
}


function disconnect() {
    return status().then(connection => {
        if (connection) {
            return execute(`nmcli connection down id "${connection.name}"`)
                .then(output => connection);
        }
        return connection;
    });
}


exports.status = status;
exports.scan = scan;
exports.network = network;
exports.connect = connect;
exports.disconnect = disconnect;
