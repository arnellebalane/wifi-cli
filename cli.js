#!/usr/bin/env node
const meow = require('meow');
const wifi = require('wifi');


const cli = meow(`
  usage:

    wf                      - display current connection
    wf list                 - list available networks
    wf connect <id|ssid>    - connect to a networrk
    wf disconnect           - disconnect from current network

  options:

    -i, --iface             - specify a wireless interface to use
`);

const command = cli.input[0] || 'list';
const network = cli.input[1];
