/* eslint-disable id-denylist */
'use strict';

const
    {pipeline} = require(`stream`),
    {createDecipheriv} = require(`crypto`),
    dcp = createDecipheriv(`aes256`, ...process.argv.slice(2, 4));

pipeline(
    process.stdin,
    dcp,
    process.stdout,
    err => {
        console.log(`pipeline is built:`);

        if (err) {
            console.error(`An error occurred:`, err);
            process.exitCode = 1;
        }
    }
);