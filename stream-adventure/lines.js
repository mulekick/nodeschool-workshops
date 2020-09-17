'use strict';

const {Transform} = require(`stream`);

class caseconverter extends Transform {
    // eslint-disable-next-line no-useless-constructor
    constructor(options) {
        super(options);
        this.counter = 0;
        this.line = ``;
    }

    _transform(chunk, encoding, callback) {

        // eslint-disable-next-line no-param-reassign
        chunk = typeof chunk === `string` ? chunk : chunk.toString(`utf8`);

        // Data is delimited by carriage return ...
        if (chunk.match(/\n/gu)) {
            // Extracting end of line and buffering the remainder
            const
                s = chunk.split(/\n/u),
                v = `${ this.line }${ s.shift() }\n`;
            this.line = ``;
            this.unshift(s.join(`\n`));
            this.push(++this.counter % 2 === 0 ? v.toUpperCase() : v.toLowerCase());
        } else {
            this.line += chunk;
        }
        callback();
    }

    _final(callback) {
        const
            v = `${ this.line }\n`;
        this.push(++this.counter % 2 === 0 ? v.toUpperCase() : v.toLowerCase());
        callback();
    }
}

const transformer = new caseconverter();

process.stdin
    .pipe(transformer)
    .pipe(process.stdout);