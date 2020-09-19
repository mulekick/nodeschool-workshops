/* eslint-disable id-denylist */
'use strict';

const
    {Duplex} = require(`stream`);

class input extends Duplex {
    constructor(label, options) {
        super(options);
        // Identifier for debugging purposes
        this.label = label;
        // Store countries
        this.objects = [];
    }

    // eslint-disable-next-line class-methods-use-this
    _write(chunk, encoding, callback) {
        this.objects.push(chunk);
        callback();
    }

    // eslint-disable-next-line class-methods-use-this
    _read() {}

    // eslint-disable-next-line class-methods-use-this
    _final(callback) {
        const
            // Count countries
            result = this.objects
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

module.exports = function(counter) {

    const dupl = new aggregator(new input(`counting`, {objectMode: true}), counter, {objectMode: true});

    // eslint-disable-next-line prefer-const
    let c = {};

    dupl.outgoing()
        .on(`data`, data => Object.assign(c, data))
        // in the end: set countryCounts in readable stream
        .on(`finish`, () => dupl.incoming().setCounts(c));

    return dupl;

};