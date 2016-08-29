# wifi-cli


Manage wireless network connections from the command line. This package wraps
the builtin `nmcli` command in Linux systems, and thus will not work on other
operating systems. Hoping to add support for other platforms soon.

[See it in action (asciinema)](https://asciinema.org/a/5hwe1rdso30almmb7kal7swqt)


## Installation

This package requires at least **Node v6**

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

  You are currently connected to NETWORK_NAME
```

Scan nearby wireless networks:

```
$ wf scan

     SSID              SECURITY     SIGNAL

  1  NETWORK_ONE       WPA WPA2     84
  2  NETWORK_TWO       WPA2         71
  3  NETWORK_THREE     --           70
```

Connect to a wireless network:

```
$ wf connect 1
$ wf connect "NETWORK_NAME"
  Password for wireless network NETWORK_NAME: *****

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
