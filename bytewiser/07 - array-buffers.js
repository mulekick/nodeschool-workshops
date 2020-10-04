/* eslint-disable multiline-comment-style */
'use strict';

const
    v = process.argv[2],
    // eslint-disable-next-line id-match
    uint32 = new Uint32Array([ v ]),
    // eslint-disable-next-line id-match
    uint16 = new Uint16Array(uint32.buffer);

console.log(JSON.stringify(uint16));