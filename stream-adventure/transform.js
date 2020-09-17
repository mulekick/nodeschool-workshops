'use strict';

const {Transform} = require(`stream`);

class uppercazer extends Transform {
    // eslint-disable-next-line no-useless-constructor
    constructor(options) {
        super(options);
    }

    _transform(chunk, encoding, callback) {
        this.push(typeof chunk === `string` ? chunk.toUpperCase() : chunk.toString(`utf8`).toUpperCase());
        callback();
    }
}

const upper = new uppercazer();

process.stdin
    .pipe(upper)
    .pipe(process.stdout);