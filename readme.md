# wifi-cli


Manage wifi connections from the command line. Wraps the builtin `nmcli`
command in Linux systems (not sure if available in other platforms, so if you
are using a different OS, this tool might not work yet). Support for other
platforms will be added the future, hopefully.


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

List wireless network connection history:

```
$ wf history

     SSID              SIGNAL

  1  "NETWORK_ONE"     =====
  2  "NETWORK_TWO"     ====
  3  "NETWORK_THREE"   ===
```

Remove a wireless network from connection history:

```
$ wf forget 1
$ wf forget "NETWORK_NAME"

  "NETWORK_NAME" removed from connection history
```

Clear connection history

```
$ wf clear

  Wireless network connection history is now cleared
```


## License

MIT License
