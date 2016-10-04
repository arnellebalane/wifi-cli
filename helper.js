/** helper functions **/

const inquirer = require('inquirer');
const widestColumnValues = require('./lib/widest-column-values');
const rightPad = require('./lib/right-pad');

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
        if (network.active === 'yes') {
            console.log(`  ${success(row)}`);
        } else {
            console.log(`  ${row}`);
        }
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


function askWifiPassword(ssid) {
    return inquirer.prompt([{
        type: 'password',
        name: 'password',
        message: `Password for wireless network ${success(ssid)}:`
    }]).then(answers => answers.password);
}
