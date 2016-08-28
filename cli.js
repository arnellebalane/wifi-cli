#!/usr/bin/env node
const meow = require('meow');
const wifi = require('wifi');


const cli = meow(`
  usage:

    wf                      - display current connection
    wf scan                 - scan nearby wireless networks
    wf connect <id|ssid>    - connect to a wireless networrk
    wf disconnect           - disconnect from current network
`);

const command = cli.input[0] || 'list';
const network = cli.input[1];
