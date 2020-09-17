'use strict';

// console.log(`beep boop`);
const {Readable} = require(`stream`);

class bufferreader extends Readable {
    // eslint-disable-next-line no-useless-constructor
    constructor(options) {
        super(options);
    }

    // eslint-disable-next-line class-methods-use-this
    _read() {
        this.push(Buffer.from(`beep boop\n`, `utf8`));
        this.push(null);
    }
}

const readable = new bufferreader();

readable.pipe(process.stdout);
