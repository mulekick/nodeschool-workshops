'use strict';

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

const
    readable = new bufferreader(),
    v = process.argv[2];

readable.setdata(v);
readable.pipe(process.stdout);