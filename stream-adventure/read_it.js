'use strict';

const
    {Readable} = require(`stream`),
    v = process.argv[2];

class bufferreader extends Readable {
    // eslint-disable-next-line no-useless-constructor
    constructor(options) {
        super(options);
    }

    // eslint-disable-next-line class-methods-use-this
    _read() {
        this.push(Buffer.from(v, `utf8`));
        this.push(null);
    }
}

const readable = new bufferreader();

readable.pipe(process.stdout);