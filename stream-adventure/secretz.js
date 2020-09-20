/* eslint-disable multiline-comment-style */
'use strict';

const
    {createDecipheriv, createHash} = require(`crypto`),
    {Parse} = require(`tar`),
    dcp = createDecipheriv(...process.argv.slice(2, 5)),
    parser = new Parse();
// Let's begin in flowing mode
process.stdin
    .pipe(dcp)
    .pipe(parser);
// And now, a bit of paused mode
parser
    .on(`entry`, entry =>  {
        const {type, path} = entry;

        if (type === `File`) {
            // Create hasher
            const hasher = createHash(`md5`, {encoding: `hex`});
            // Write to stdout
            hasher
                .on(`data`, c => process.stdout.write(c));
            // Write extracted data to hasher
            entry
                .on(`data`, c => hasher.write(c))
                .on(`end`, () => {
                    // Signal write-style EOF
                    hasher.end();
                    // Write additional data to stdout
                    process.stdout.write(` ${ path }\n`);
                });
        } else {
            // Discard data
            entry.resume();
        }
    });