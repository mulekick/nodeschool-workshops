'use strict';

const {Writable} = require(`stream`);

class consolewriter extends Writable {
    // eslint-disable-next-line no-useless-constructor
    constructor(options) {
        super(options);
    }

    // eslint-disable-next-line class-methods-use-this
    _write(chunk, encoding, callback) {
        console.log(`writing: ${ typeof chunk === `string` ? chunk : chunk.toString() }`);
        callback();
    }
}

const
    writable = new consolewriter();

process.stdin.pipe(writable);