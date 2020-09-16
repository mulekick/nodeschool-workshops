'use strict';

const
    fs = require(`fs`),
    file = process.argv[2];

fs.createReadStream(file, {encoding: `utf8`}).pipe(process.stdout);