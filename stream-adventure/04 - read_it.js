'use strict';

const
    {bufferreader} = require(`./stream-lib`),
    v = process.argv[2],
    readable = new bufferreader(Buffer.from(v, `utf8`));

readable.pipe(process.stdout);