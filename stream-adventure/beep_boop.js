'use strict';

// console.log(`beep boop`);
const {Readable} = require(`stream`);

class bufferreader extends Readable {
    // eslint-disable-next-line no-useless-constructor
    constructor(options) {
        super(options);
    }

    setdata(s) {
        this.push(Buffer.from(s, `utf8`));
        this.push(null);
    }

    // eslint-disable-next-line class-methods-use-this
    _read() {}
}

const readable = new bufferreader();

readable.setdata(`beep boop\n`);
readable.pipe(process.stdout);
