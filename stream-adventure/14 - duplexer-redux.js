'use strict';

const {input, aggregator} = require(`./stream-lib`);

module.exports = function(counter) {

    const dupl = new aggregator(new input({objectMode: true}), counter, {objectMode: true});

    // eslint-disable-next-line prefer-const
    let c = {};

    dupl.outgoing()
        .on(`data`, data => Object.assign(c, data))
        // in the end: set countryCounts in readable stream
        .on(`finish`, () => dupl.incoming().setCounts(c));

    return dupl;

};