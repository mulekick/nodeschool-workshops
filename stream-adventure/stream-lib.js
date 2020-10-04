/* eslint-disable id-denylist */
/* eslint-disable multiline-comment-style */
'use strict';

const {Readable, Writable, Duplex, Transform} = require(`stream`);

// ==> ALWAYS READ BUFFERS, PUSH STRINGS IF NEEDED <==

// ----------------------------------
class bufferreader extends Readable {
    constructor(b, options) {
        super(options);
        this.buf = b;
    }

    _read() {
        this.push(this.buf);
        // Signal EOF
        this.push(null);
    }
}

// ----------------------------------
class consolewriter extends Writable {
    // eslint-disable-next-line no-useless-constructor
    constructor(options) {
        super(options);
    }

    // eslint-disable-next-line class-methods-use-this
    _write(chunk, encoding, callback) {
        // Incoming buffer
        console.log(`writing: ${ chunk.toString(`utf8`) }`);
        // Success
        callback(null);
    }
}

// ----------------------------------
class uppercazer extends Transform {
    // eslint-disable-next-line no-useless-constructor
    constructor(options) {
        super(options);
    }

    _transform(chunk, encoding, callback) {
        // Incoming buffer
        this.push(chunk.toString(`utf8`).toUpperCase());
        // Success
        callback(null);
    }

    _final(callback) {
        // Signal EOF
        this.push(null);
        callback();
    }
}

// ----------------------------------
class caseconverter extends Transform {
    constructor(options) {
        super(options);
        // Init counter
        this.counter = 0;
        // Init empty member buffer
        this.line = Buffer.from(``);
    }

    _transform(buf, encoding, callback) {
        // Incoming buffer
        let bytes = buf;

        // If there's at least a new line in buffer
        if (bytes.indexOf(0x0a) >= 0) {
            let i = null;

            // Isolate lines
            while ((i = bytes.indexOf(0x0a)) >= 0) {
                // Add end of line to member buffer, add carriage return
                this.line = Buffer.concat([ this.line, bytes.slice(0, i), Buffer.from([ 0x0a ]) ]);
                // Push member buffer
                this.push(++this.counter % 2 === 0 ? this.line.toString(`utf8`).toUpperCase() : this.line.toString(`utf8`).toLowerCase());
                // Empty member buffer
                this.line = Buffer.from(``);
                // Remove end of line
                bytes = bytes.slice(i + 1);
            }
        }

        // Add remainder to member buffer
        this.line = Buffer.concat([ this.line, bytes ]);

        // Success
        callback(null);
    }

    _final(callback) {
        // Add carriage return
        this.line = Buffer.concat([ this.line, Buffer.from([ 0x0a ]) ]);
        // Push member buffer
        this.push(++this.counter % 2 === 0 ? this.line.toString(`utf8`).toUpperCase() : this.line.toString(`utf8`).toLowerCase());
        // Signal EOF
        this.push(null);
        callback();
    }
}

// ----------------------------------
class concatenator extends Duplex {
    constructor(options) {
        super(options);
        // Store an array of buffers
        this.buffers = [];
    }

    _write(chunk, encoding, callback) {
        // Push incoming buffers into member buffers array
        this.buffers.push(chunk);
        // Success
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
        // Signal EOF
        this.push(null);
        callback();
    }
}

// ----------------------------------
class htmlmodifier extends Transform {
    // eslint-disable-next-line no-useless-constructor
    constructor(options) {
        super(options);
        this.buffers = [];
    }

    _transform(chunk, encoding, callback) {
        // Push incoming buffer into member buffers array
        this.buffers.push(chunk);
        // Success
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
        // Signal EOF
        this.push(null);
        callback();
    }
}

// ----------------------------------
class aggregator extends Duplex {
    constructor(w, r, options) {
        super(options);
        // Store 'outgoing' and 'incoming' duplex streams
        this.outStream = w;
        this.inStream = r;
        this.inStream
            // Data from the 'incoming' stream has to be read in paused mode
            // and pushed into the readable buffer
            // No data from the 'incoming' stream is read in flowing mode, so it's OK
            .on(`readable`, () => {
                // eslint-disable-next-line init-declarations
                let data;

                // eslint-disable-next-line no-cond-assign
                while (data = this.inStream.read())
                    this.push(data);
            })
            // No more data to read from the 'incoming' stream
            // so null is pushed into the readable buffer to signal EOF
            .on(`end`, () => {
                this.push(null);
            });
    }

    // eslint-disable-next-line class-methods-use-this
    _write(chunk, encoding, callback) {
        // Flowing mode implementation, each data written in the writable
        // buffer is immediately written into the 'outgoing' writable buffer as well
        this.outStream.write(chunk);
        // Success
        callback(null);
    }

    // eslint-disable-next-line class-methods-use-this
    _read() {
        // Reading data from the readable buffer
    }

    // eslint-disable-next-line class-methods-use-this
    _final(callback) {
        // Flowing mode implementation, no more data to write in the writable
        // buffer, so we end the 'outgoing' stream
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

// ----------------------------------
class input extends Duplex {
    constructor(label, options) {
        super(options);
        // Identifier for debugging purposes
        this.label = label;
        // Store countries
        this.objects = [];
    }

    // eslint-disable-next-line class-methods-use-this
    _write(obj, encoding, callback) {
        // Incoming object
        this.objects.push(obj);
        // Success
        callback(null);
    }

    // eslint-disable-next-line class-methods-use-this
    _read() {}

    // eslint-disable-next-line class-methods-use-this
    _final(callback) {
        const
            // Count countries
            result = this.objects
                // eslint-disable-next-line no-unused-vars
                .reduce((r, x, i, a) => {
                    const {country} = x;
                    r[country] ? ++r[country] : r[country] = 1;

                    return r;
                }, {});
        // Push in readable buffer
        this.push(result);
        // Signal EOF
        this.push(null);
        callback();
    }
}

// ----------------------------------
class linesextractor extends Duplex {
    // Set writable object mode to false, readable object mode to true
    constructor(options) {
        super(options);
        // Init empty member buffer
        this.jsondata = Buffer.from(``);
    }

    _write(buf, encoding, callback) {
        // Incoming buffer
        let bytes = buf;

        // If there's at least a new line in buffer
        if (bytes.indexOf(0x0a) >= 0) {
            let i = null;

            // Isolate lines
            while ((i = bytes.indexOf(0x0a)) >= 0) {
                // Add end of line to member buffer
                this.jsondata = Buffer.concat([ this.jsondata, bytes.slice(0, i) ]);

                // Parse member buffer
                try {
                    // Empty string throws generic error
                    if (this.jsondata === ``)
                        throw new Error();

                    const obj = JSON.parse(this.jsondata.toString(`utf8`));
                    // Push object into readable buffer
                    this.push(obj);
                } catch (err) {
                    if (err instanceof SyntaxError)
                        console.error(`invalid JSON : ${ this.jsondata.toString(`utf8`) }`);
                }
                // Empty member buffer
                this.jsondata = Buffer.from(``);
                // Remove end of line
                bytes = bytes.slice(i + 1);
            }
        }

        // Add remainder to member buffer
        this.jsondata = Buffer.concat([ this.jsondata, bytes ]);

        // Success
        callback(null);
    }

    // eslint-disable-next-line class-methods-use-this
    _read() {}

    _final(callback) {

        // Parse member buffer
        try {
            // Empty string throws generic error
            if (this.jsondata === ``)
                throw new Error();

            const obj = JSON.parse(this.jsondata.toString(`utf8`));
            // Push object into readable buffer
            this.push(obj);
        } catch (err) {
            if (err instanceof SyntaxError)
                console.error(`invalid JSON : ${ this.jsondata.toString(`utf8`) }`);
        }
        // Signal EOF
        this.push(null);
        callback();
    }
}

// ----------------------------------
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
    _write(obj, encoding, callback) {
        // Incoming object
        // eslint-disable-next-line no-shadow
        const {type, name} = obj;
        // eslint-disable-next-line no-unused-expressions
        type === `genre` ? this.cat.push({name: name, books: []}) : type === `book` ? this.cat[this.cat.length - 1][`books`].push(name) : false;
        // Success
        callback(null);
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

module.exports = {
    bufferreader,
    consolewriter,
    uppercazer,
    caseconverter,
    concatenator,
    htmlmodifier,
    aggregator,
    input,
    linesextractor,
    bookclassifier
};