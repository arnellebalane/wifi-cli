#!/usr/bin/env node
const meow = require('meow');
const spinner = require('ora')();
const wifi = require('.');

const widestColumnValues = require('./lib/widest-column-values');
const rightPad = require('./lib/right-pad');


const cli = meow(`
  usage:

    wf                      - display current connection
    wf scan                 - scan nearby wireless networks
    wf connect <id|ssid>    - connect to a wireless networrk
    wf disconnect           - disconnect from current network
`);

const command = cli.input[0] || 'status';
const network = cli.input[1];



let promise = null;
spinner.start();

if (command === 'status') {
    spinner.text = 'Retrieving wireless network status';

    promise = wifi.status().then(network => {
        if (!network) {
            throw new Error('You are not connected to any wireless networks');
        }
        spinner.text = `You are currently connected to ${network.name}`;
        spinner.succeed();
    });
} else if (command === 'scan') {
    spinner.text = 'Scanning nearby wireless networks';

    promise = wifi.scan().then(networks => {
        if (networks.length === 0) {
            throw new Error('No wireless networks found');
        }
        spinner.stop();
        return displayWifiTable(networks);
    });
} else {
    promise = Promise.reject(new Error(`Unknown command: ${command}`))
}

promise.catch(error => {
    spinner.text = error.message;
    spinner.fail();
})



function displayWifiTable(networks) {
    const lengths = widestColumnValues(networks);
    lengths.ssid = Math.max(lengths.ssid, 'NAME'.length);
    lengths.security = Math.max(lengths.security, 'SECURITY'.length);
    lengths.signal = Math.max(lengths.signal, 'SIGNAL'.length);

    const headRow = wifiTableRow('', 'SSID', 'SECURITY', 'SIGNAL', lengths);
    console.log(`\n  ${headRow}\n`);

    networks.forEach((network, i) => {
        const row = wifiTableRow(i + 1, network.ssid, network.security || '-',
            network.signal, lengths);
        console.log(`  ${row}`);
    });
    return networks;
}


function wifiTableRow(id, ssid, security, signal, lengths) {
    return [
        rightPad(id, 3) + rightPad(ssid, lengths.ssid),
        rightPad(security, lengths.security),
        rightPad(signal, lengths.signal)
    ].join(' '.repeat(5));
}
