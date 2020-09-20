/* eslint-disable multiline-comment-style */
/* eslint-disable no-empty-function */
/* eslint-disable id-denylist */
'use strict';

const
    {Duplex, pipeline} = require(`stream`),
    {createGzip} = require(`zlib`);

class linesextractor extends Duplex {

    // Set writable object mode to false, readable object mode to true

    // eslint-disable-next-line no-useless-constructor
    constructor(options) {
        super(options);
        // Init empty member buffer
        this.jsonstring = ``;
    }

    _write(chunk, encoding, callback) {
        // Add data chunk read from stdin to member Buffer
        this.jsonstring += typeof chunk === `string` ? chunk : chunk.toString(`utf8`);

        if (/\n/gu.test(this.jsonstring)) {
            // Split resulting string on newlines
            const arr = this.jsonstring.split(/\n/gu);
            // Empty member buffer
            this.jsonstring = ``;

            // Parse all elements from resulting array
            for (const jsondata of arr) {
                try {
                    // Empty string throws generic error
                    if (jsondata === ``)
                        throw new Error();

                    const obj = JSON.parse(jsondata);
                    // Push all objects into readable buffer after parsing
                    this.push(obj);
                } catch (err) {
                    if (err instanceof SyntaxError)
                        console.error(`invalid JSON : ${ jsondata }`);
                }
            }

        }
        callback();
    }

    // eslint-disable-next-line class-methods-use-this
    _read() {}

    _final(callback) {
        // Signal EOF
        this.push(null);
        callback();
    }
}

class bookclassifier extends Duplex {

    // Set writable object mode to true
    // Set readable object mode to false
    // Set highwatermark to 1 (read 1 object at a time from extractor)

    constructor(options) {
        super(options);
        // Store catalogue
        this.cat = [];
    }

    // eslint-disable-next-line class-methods-use-this
    _write(chunk, encoding, callback) {
        // Process object for catalogue
        // eslint-disable-next-line no-shadow
        const {type, name} = chunk;
        // eslint-disable-next-line no-unused-expressions
        type === `genre` ? this.cat.push({name: name, books: []}) : type === `book` ? this.cat[this.cat.length - 1][`books`].push(name) : false;
        callback();
    }

    // eslint-disable-next-line class-methods-use-this
    _read() {}

    // eslint-disable-next-line class-methods-use-this
    _final(callback) {
        // Push in readable buffer
        this.push(JSON.stringify(this.cat));
        // Signal EOF
        this.push(null);
        callback();
    }
}

// Why can't I move this into a module ?
class aggregator extends Duplex {
    constructor(w, r, options) {
        super(options);
        // Store 'outgoing' and 'incoming' duplex streams
        this.outStream = w;
        this.inStream = r;
        this.inStream
            .on(`readable`, () => {
                // eslint-disable-next-line init-declarations
                let data;

                // eslint-disable-next-line no-cond-assign
                while (data = this.inStream.read())
                    this.push(data);
            })
            .on(`end`, () => {
                this.push(null);
            });
    }

    // eslint-disable-next-line class-methods-use-this
    _write(chunk, encoding, callback) {
        this.outStream.write(chunk);
        callback();
    }

    // eslint-disable-next-line class-methods-use-this
    _read() {}

    // eslint-disable-next-line class-methods-use-this
    _final(callback) {
        this.outStream.end();
        callback();
    }

    incoming() {
        return this.inStream;
    }

    outgoing() {
        return this.outStream;
    }
}

module.exports = function() {
    const
        extr = new linesextractor({writableObjectMode: false, readableObjectMode: true}),
        bkcl = new bookclassifier({writableObjectMode: true, readableObjectMode: false, writableHighWaterMark: 1}),
        gzip = createGzip();
    // Create pipeline
    pipeline(
        extr,
        bkcl,
        gzip,
        err => {
            console.log(`pipeline is built:`);

            if (err) {
                console.error(`An error occurred:`, err);
                process.exitCode = 1;
            }
        });

    // Aggregate first and last stream (pipeline returns last stream, unusable ...)
    return new aggregator(extr, gzip, {objectMode: false});
};