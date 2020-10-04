'use strict';

process.stdin
    .on(`data`, buf => {
        let i = null;

        // Incoming buffer
        while ((i = buf.indexOf(0x2e)) >= 0)
            // Replace byte
            buf.writeInt8(0x21, i);
        // Log
        console.log(buf);
    });