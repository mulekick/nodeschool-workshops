'use strict';

const
    http = require(`http`),
    opts =  {
        method: `POST`
    },
    req = http
        .request(`http://localhost:8099`, opts, res => res.pipe(process.stdout))
        .on(`error`, e => console.error(`request failed : ${ e.message }`));

process.stdin.pipe(req);