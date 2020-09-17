'use strict';

const {Duplex} = require(`stream`);

class duplexer extends Duplex {
    // eslint-disable-next-line no-useless-constructor
    constructor(options) {
        super(options);
        // Store an array of buffers
        this.buffers = [];
    }

    _write(chunk, encoding, callback) {
        // Push incoming buffers into member buffers array
        this.buffers.push(chunk);
        callback(null);
    }

    // eslint-disable-next-line class-methods-use-this
    _read() {
        // Waiting for all data to be buffered before pushing
    }

    _final(callback) {
        // Concat member buffers array and push into readable buffer
        const r = Buffer.concat(this.buffers).toString(`utf8`);
        this.push(r.split(``).reverse().join(``));
        callback();
    }
}

const
    dplxr = new duplexer({decodeStrings: false, objectMode: false});

process.stdin
    .pipe(dplxr)
    .pipe(process.stdout);