# wifi-cli


Manage wireless network connections from the command line. This package wraps
the builtin `nmcli` command in Linux systems, and thus will not work on other
operating systems.


## Installation

To use this tool, you have to install it globally through `npm`:

```
$ npm install -g wifi-cli
```

After installation, you will then have the `wf` command available from the
command line.


## Usage

Display current wireless network connection:

```
$ wf

  You are connected to "NETWORK_NAME"
```

List available wireless networks:

```
$ wf list

     SSID              SIGNAL

  1  "NETWORK_ONE"     =====
  2  "NETWORK_TWO"     ====
  3  "NETWORK_THREE"   ===
```

Connect to a wireless network (if the network is already in your history,
you might not be asked for a password again):

```
$ wf connect 1
$ wf connect "NETWORK_NAME"
  password:

  You are now connected to "NETWORK_NAME"
```

Disconnecting from a wireless network:

```
$ wf disconnect

  You are now disconnected from "NETWORK_NAME"
```


## License

MIT License


[wifi-control]: https://www.npmjs.com/package/wifi-control
