'use strict';

const
    fs = require(`fs`),
    fp = process.argv[2],
    fc = fs.readFileSync(fp, `utf8`),
    nb = fc.match(/\n/gu);
console.log(nb.length);