const shell = require('shelljs');
const multilineToJsonArray = require('./lib/multiline-to-json-array');

class WF {

  constructor() {
    return new Proxy(this, {
      get: (obj, prop) => {
        if (prop in obj) {
          const value = Reflect.get(obj, prop);
          if (typeof value === 'function') {
            return value.bind(obj);
          } else {
            return value;
          }
        } else {
          return undefined;
        }
      }
    });
  }

  execute(command) {
    return new Promise((resolve, reject) => {
      shell.exec(command, {
        silent: true
        }, (code, stdout, stderr) => {
          if (code) {
            reject(stderr.trim());
          } else {
            resolve(stdout.trim());
          }
        });
    });
  }


  async status() {
    let network = await this.execute('nmcli d | grep wifi');
    network = network.split(/\s{2,}/);
    if (network[2] === 'connected') {
      return {
        name: network[3].split(' ')[0]
      };
    }
    return false;
  }


  async scan() {
    const networks = multilineToJsonArray(
      await this.execute('nmcli -m multiline device wifi list'));
    return networks.map(network => {
      network.ssid = network.ssid.replace(/^'|'$/g, '');
      return network;
    }).sort((a, b) => b.signal - a.signal);
  }

  findNetwork(id, networks) {
    if (typeof id === 'number' && id > 0 && id <= networks.length) {
        return networks[id - 1];
    }
    return networks.find(network => network.ssid === id);
  }

  async networkFromScan(id) {
    const networks = await this.scan();
    return this.findNetwork(id, networks);
  }

  async networkFromHistory(id) {
    const networks = await this.history();
    return this.findNetwork(id, networks);
  }

  async connect(ssid, password) {
    let command = `nmcli device wifi connect "${ssid}"`;
    if (password) {
        command += ` password "${password}"`;
    }
    return await this.status(
      await this.execute(command));
  }

  async disconnect() {
    const connection = await this.status();
    if (connection) {
      const output = await this.execute(`nmcli connection down id "${connection.name}"`);
      return connection;
    } else {
      return connection;
    }
  }

  async history() {
    const network = multilineToJsonArray(
      await this.execute('nmcli -m multiline connection'));

    return network.filter((network) => {
      return network.type === '802-11-wireless';
    }).sort((a, b) => a.name == b.name ? 0 : a.name < b.name ? -1 : 1);
  }

  async forget(ssid) {
    if (ssid) {
      const network = await this.networkFromHistory(ssid);
      return await this.status(
        this.execute(`nmcli connection delete '${network.name}'`));
    } else {
      const networks = this.history();

      if (networks.length === 0) {
        throw new Error('You have no connection history');
      }

      const connectionList =
            networks.map((a) => `'${a.name}'`).join(" ");

      return await this.status(
        await this.execute(`nmcli connection delete ${connectionList}`));
    }
  }
}

module.exports = new WF();
