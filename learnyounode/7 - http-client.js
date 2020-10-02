/* eslint-disable id-denylist */
'use strict';

const
    http = require(`http`),
    url = process.argv[2],
    cb = res => {
        res.setEncoding(`utf8`);
        res
            .on(`data`, chunk => console.log(chunk))
            .on(`error`, err => console.error(`Error : ${ err }`))
            .on(`end`, () => null);
    };
http
    .get(url, cb)
    .on(`error`, err => console.error(`Error : ${ err }`));