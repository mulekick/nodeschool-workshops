'use strict';

const
    {pipeline} = require(`stream`),
    {createGzip} = require(`zlib`),
    {linesextractor, bookclassifier, aggregator} = require(`./stream-lib`);

module.exports = function() {
    const
        extr = new linesextractor({decodeStrings: true, defaultEncoding: `utf8`, writableObjectMode: false, readableObjectMode: true}),
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
    return new aggregator(extr, gzip, {decodeStrings: true, defaultEncoding: `utf8`, objectMode: false});
};