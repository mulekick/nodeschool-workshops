/* eslint-disable id-denylist */
/* eslint-disable multiline-comment-style */
'use strict';

const
    {spawn} = require(`child_process`),
    {Duplex} = require(`stream`);

// Why can't I move this into a module ?
class aggregator extends Duplex {
    constructor(w, r, source, options) {
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
                    this.push(data.toString(`utf8`));
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
        this.outStream.write(chunk.toString(`utf8`));
        callback();
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

module.exports = function(cmd, args) {
    const
        childp = spawn(cmd, args),
        dupl = new aggregator(childp.stdin, childp.stdout);

    return dupl;
};


