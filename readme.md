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


## Usage

Display current wireless network connection:

```
$ wifi

  You are connected to "NETWORK_NAME"
```

List available wireless networks:

```
$ wifi list

     SSID              SIGNAL

  1  "NETWORK_ONE"     =====
  2  "NETWORK_TWO"     ====
  3  "NETWORK_THREE"   ===
```

Connect to a wireless network (if the network is already in your history,
you might not be asked for a password again):

```
$ wifi connect 1
$ wifi connect "NETWORK_NAME"
  password:

  You are now connected to "NETWORK_NAME"
```

Disconnecting from a wireless network:

```
$ wifi disconnect

  You are now disconnected from "NETWORK_NAME"
```

List wireless network connection history:

```
$ wifi history

     SSID              SIGNAL

  1  "NETWORK_ONE"     =====
  2  "NETWORK_TWO"     ====
  3  "NETWORK_THREE"   ===
```

Remove a wireless network from connection history:

```
$ wifi forget 1
$ wifi forget "NETWORK_NAME"

  "NETWORK_NAME" removed from connection history
```

Clear connection history

```
$ wifi clear

  Wireless network connection history is now cleared
```


## License

MIT License
