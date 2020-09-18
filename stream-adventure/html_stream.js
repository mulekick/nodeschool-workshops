'use strict';

const {Transform} = require(`stream`);

class htmlmodifier extends Transform {
    // eslint-disable-next-line no-useless-constructor
    constructor(options) {
        super(options);
        this.buffers = [];
    }

    _transform(chunk, encoding, callback) {
        // Default encoding is UTF8, so chunk type does not matter
        const b = Buffer.from(chunk);
        // Push incoming buffers into member buffers array
        this.buffers.push(b);
        callback(null);
    }

    _final(callback) {
        const
            // Concat member buffers array and convert to string
            html = Buffer.concat(this.buffers).toString(`utf8`),
            // eslint-disable-next-line prefer-named-capture-group
            rgx = /(?<=[^<]+class="loud"[^>]*>)([^<]+)(?=<)/gu;
        // push into readable buffer
        this.push(html.replace(rgx, (match, offset, string) => match.toUpperCase()));
        callback();
    }
}

const upper = new htmlmodifier();

process.stdin
    .pipe(upper)
    .pipe(process.stdout);