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


if (command === 'scan') {
    spinner.start();
    spinner.text = 'Scanning nearby wireless networks'

    wifi.scan()
        .then(networks => {
            if (networks.length === 0) {
                throw new Error('No wireless networks found');
            }
            spinner.stop();
            return networks;
        })
        .then(networks => {
            const lengths = widestColumnValues(networks);
            lengths.ssid = Math.max(lengths.ssid, 'NAME'.length);
            lengths.security = Math.max(lengths.security, 'SECURITY'.length);
            lengths.signal = Math.max(lengths.signal, 'SIGNAL'.length);

            let tableHead = [
                rightPad('', 3) + rightPad('NAME', lengths.ssid),
                rightPad('SECURITY', lengths.security),
                rightPad('SIGNAL', lengths.signal)
            ].join(' '.repeat(5));
            console.log(`\n  ${tableHead}\n`);

            networks.forEach((network, i) => {
                let tableRow = [
                    rightPad(i + 1, 3) + rightPad(network.ssid, lengths.ssid),
                    rightPad(network.security, lengths.security),
                    rightPad(network.signal, lengths.signal)
                ].join(' '.repeat(5));
                console.log(`  ${tableRow}`);
            });
            return networks;
        })
        .catch(error => {
            spinner.text = error.message;
            spinner.fail();
        });
}
