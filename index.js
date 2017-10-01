const shell = require('shelljs');
const multilineToJsonArray = require('./lib/multiline-to-json-array');

function execute(command) {
    return new Promise((resolve, reject) => {
        shell.exec(command, {
            silent: true
        }, (code, stdout, stderr) => {
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
                return {
                    name: network[3]
                };
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

function findNetwork(id, networks) {
    if (typeof id === 'number' && id > 0 && id <= networks.length) {
        return networks[id - 1];
    }
    return networks.find(network => network.ssid === id);
}

function networkFromScan(id) {
    return scan().then(networks => {
        return findNetwork(id, networks);
    });
}

function networkFromHistory(id) {
    return history().then(networks => {
        return findNetwork(id, networks);
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

function history() {
    return execute('nmcli -m multiline connection')
        .then(multilineToJsonArray)
        .then(network => {
            return network.filter((network) => {
                return network.type === '802-11-wireless';
            });
        })
        .then(networks => networks.sort((a, b) => a.name == b.name ? 0 : a.name < b.name ? -1 : 1));
}

function forget(ssid) {
    if (ssid) {
        return networkFromHistory(ssid).then(network => {
            return execute(`nmcli connection delete '${network.name}'`).then(status);
        });
    }

    return history().then(networks => {
        if (networks.length === 0) {
            throw new Error('You have no connection history');
        }
        const connectionList = networks.map((a) => `'${a.name}'`).join(" ");
        return execute(`nmcli connection delete ${connectionList}`).then(status);
    });
}

exports.status = status;
exports.scan = scan;
exports.networkFromScan = networkFromScan;
exports.networkFromHistory = networkFromHistory;
exports.connect = connect;
exports.disconnect = disconnect;
exports.history = history;
exports.forget = forget;
