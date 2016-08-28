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


function getConnectedInterfaces() {
    return execute('nmcli -m multiline device')
        .then(multilineToJsonArray)
        .then(ifaces => ifaces.filter(iface => iface.state === 'connected'));
}


function getConnectedInterface() {
    return getConnectedInterfaces().then(ifaces => ifaces[0].device);
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


exports.status = status;
exports.scan = scan;
