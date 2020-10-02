/* eslint-disable id-denylist */
'use strict';

let data = ``;

const
    http = require(`http`),
    url = process.argv[2],
    cb = res => {
        res.setEncoding(`utf8`);
        res
            // eslint-disable-next-line no-return-assign
            .on(`data`, chunk => data += chunk)
            .on(`error`, err => console.error(`Error : ${ err }`))
            .on(`end`, () => {
                console.log(data.length);
                console.log(data);
            });
    };

http
    .get(url, cb)
    .on(`error`, err => console.error(`Error : ${ err }`));