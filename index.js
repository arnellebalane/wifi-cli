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
        .then(interfaces => {
            return interfaces.filter(iface => iface.state === 'connected');
        });
}


function getConnectedInterface() {
    return getConnectedInterfaces().then(interfaces => interfaces[0].device);
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


exports.scan = scan;
