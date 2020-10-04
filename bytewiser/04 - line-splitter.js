/* eslint-disable multiline-comment-style */
'use strict';

const
    {linesplitter} = require(`./stream-lib`),
    {createReadStream} = require(`fs`),
    path = process.argv[2];

const
    reader = createReadStream(path, {encoding: `utf8`}),
    splitter = new linesplitter({decodeStrings: true, defaultEncoding: `utf8`, objectMode: false});

reader
    .pipe(splitter);