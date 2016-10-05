/** helper functions **/
const chalk = require('chalk');
const inquirer = require('inquirer');
const widestColumnValues = require('./lib/widest-column-values');
const rightPad = require('./lib/right-pad');
const success = chalk.green.bold;
const fail = chalk.red.bold;

const log = require('./lib/logger').log;

const wifiTableRow = (id, displayFields, displayLengths) => {
    let padObj = [rightPad(id, 2)];

    for(let i=0; i < displayFields.length; i++) {
        padObj.push(rightPad(displayFields[i], displayLengths[i]));
    }

    return padObj.join(' '.repeat(5));
};

exports.displayWifiTable = (networks) => {
    const lengths = widestColumnValues(networks);
    let displayLengths = [
        Math.max(lengths.ssid, 'NAME'.length),
        Math.max(lengths.security, 'SECURITY'.length),
        Math.max(lengths.signal, 'SIGNAL'.length)
    ];
    let displayFields = ['SSID', 'SECURITY', 'SIGNAL'];

    const headRow = wifiTableRow('', displayFields, displayLengths);
    console.log(`\n  ${headRow}\n`);

    networks.forEach((network, i) => {
        displayFields = [network.ssid, network.security || '-', network.signal];
        const row = wifiTableRow(i + 1, displayFields, displayLengths);
        if (network.active === 'yes') {
            console.log(`  ${success(row)}`);
        } else {
            console.log(`  ${row}`);
        }
    });
    return networks;
};

exports.displayHistoryTable = (networks) => {
    const lengths = widestColumnValues(networks);
    let displayLengths = [
        Math.max(lengths.name, 'NAME'.length),
        Math.max(lengths.uuid, 'UUID'.length),
        Math.max(lengths.type, 'TYPE'.length)
    ];
    let displayFields = ['NAME', 'UUID', 'TYPE'];

    const headRow = wifiTableRow('', displayFields, displayLengths);
    console.log(`\n  ${headRow}\n`);

    networks.forEach((network, i) => {
        displayFields = [network.name, network.uuid, network.type];
        const row = wifiTableRow(i + 1, displayFields, displayLengths);
        console.log(`  ${row}`);
    });
    return networks;
};

exports.askWifiPassword = (ssid) => {
    return inquirer.prompt([{
        type: 'password',
        name: 'password',
        message: `Password for wireless network ${success(ssid)}:`
    }]).then(answers => answers.password);
};
