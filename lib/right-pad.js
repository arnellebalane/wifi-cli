function rightPad(string, width) {
    string = String(string);
    return string + (' '.repeat(width - string.length));
}


module.exports = rightPad;
