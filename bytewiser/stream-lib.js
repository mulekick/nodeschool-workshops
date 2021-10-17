'use strict';

const {Writable, Transform} = require(`stream`);

// ==> ALWAYS READ BUFFERS, PUSH STRINGS IF NEEDED <==

// ----------------------------------
class linesplitter extends Transform {
    constructor(options) {
        super(options);
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
                // Add end of line to member buffer
                this.line = Buffer.concat([ this.line, bytes.slice(0, i) ]);
                // Log member buffer
                console.log(this.line);
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
        // Log member buffer
        console.log(this.line);
        // Signal EOF
        this.push(null);
        callback();
    }

}

// ----------------------------------
class concat extends Writable {
    constructor(options) {
        super(options);
        // Init empty member buffer
        this.buffer = Buffer.from(``);
    }

    _write(buf, encoding, callback) {
        // Incoming buffer
        this.buffer = Buffer.concat([ this.buffer, buf ]);
        // Success
        callback(null);
    }

    _final(callback) {
        // Output member buffer
        console.log(this.buffer);
        // Since this is not a duplex, no EOF to signal
        callback();
    }
}

// ----------------------------------
// eslint-disable-next-line id-match
class uint8reader extends Writable {
    // eslint-disable-next-line no-useless-constructor
    constructor(options) {
        super(options);
    }

    // eslint-disable-next-line class-methods-use-this
    _write(buf, encoding, callback) {
        // Incoming buffer

        // Pass buffer to typed array constructor, stringify and log
        console.log(JSON.stringify(new Uint8Array(buf)));
        // Success
        callback(null);
        // Exit right now
        process.exit();
    }
}

module.exports = {
    linesplitter,
    concat,
    // eslint-disable-next-line id-match
    uint8reader
};