#!/usr/bin/env node
const helper = require('./helper');
const meow = require('meow');
const spinner = require('ora')();
const chalk = require('chalk');
const wifi = require('.');

const success = chalk.green.bold;
const fail = chalk.red.bold;

const cli = meow(`
  usage:

    wf                      - display current connection
    wf s|scan               - scan nearby wireless networks
    wf c|connect <id|ssid>  - connect to a wireless network
    wf dc|disconnect        - disconnect from current network
    wf h|istory             - list connection history
    wf f|orget <index|ssid> - remove the network with the given ssid or index
    wf f|orget              - forget all the networks in the connection history
`);

const command = cli.input[0] || 'status';
const target = cli.input[1];


let promise = null;

switch (command) {
    case 'status':
        promise = status();
        break;
    case 'scan':
    case 's':
        promise = scan();
        break;
    case 'connect':
    case 'c':
        promise = connect(target);
        break;
    case 'disconnect':
    case 'dc':
        promise = disconnect();
        break;
    case 'history':
    case 'h':
        promise = history();
        break;
    case 'forget':
    case 'f':
        promise = forget(target);
        break;
    default:
        promise = Promise.reject(new Error(`Unknown command: ${command}`));
}

promise.catch(error => {
    spinner.text = error.message;
    spinner.fail();
});

/** core command actions **/

function status() {
    spinner.start();
    spinner.text = 'Retrieving wireless network status';
    return wifi.status().then(network => {
        if (!network) {
            throw new Error('You are not connected to any wireless networks');
        }
        spinner.text = `You are currently connected to ${success(network.name)}`;
        spinner.succeed();
    });
}


function scan() {
    spinner.start();
    spinner.text = 'Scanning nearby wireless networks';
    return wifi.scan().then(networks => {
        if (networks.length === 0) {
            throw new Error('No wireless networks found');
        }
        spinner.stop();
        return helper.displayWifiTable(networks);
    });
}


function connect(target) {{
    spinner.start();
    spinner.text = 'Establishing wireless network connection';
    return wifi.network(target).then(network => {
        if (!network) {
            throw new Error(`Wireless network ${fail(target)} not found`);
        } else if (!network.security) {
            return Promise.resolve([network.ssid]);
        }
        spinner.stop();
        return helper.askWifiPassword(network.ssid)
            .then(password => [network.ssid, password]);
    }).then(credentials => {
        spinner.text = `Connecting to wireless network ${success(credentials[0])}`;
        spinner.start();
        return wifi.connect(...credentials).catch(error => {
            throw new Error(`Failed to connect to ${fail(credentials[0])}`);
        });
    }).then(network => {
        spinner.text = `You are now connected to ${success(network.name)}`;
        spinner.succeed();
    });
}}


function disconnect() {
    spinner.start();
    spinner.text = 'Disconnecting from wireless network';
    return wifi.disconnect().then(network => {
        if (network) {
            spinner.text = `You are now disconnected from ${success(network.name)}`;
        } else {
            spinner.text = `You are now disconnected from the network.`;
        }
        spinner.succeed();
    });
}

function history() {
    spinner.start();
    spinner.text = 'Listing the connection history';
    return wifi.history().then(networks => {
      if (networks.length === 0) {
          throw new Error('You have no connection history');
      }
      spinner.stop();
      return helper.displayHistoryTable(networks);
    });
}

function forget(target) {

}
