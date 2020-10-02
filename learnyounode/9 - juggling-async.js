/* eslint-disable id-denylist */
'use strict';

const
    http = require(`http`),
    urls = process.argv.slice(2, 5),
    retrieve = url => new Promise((resolve, reject) => {
        http
            .get(url, res => {
                let data = ``;
                res.setEncoding(`utf8`);
                res
                    // eslint-disable-next-line no-return-assign
                    .on(`data`, chunk => data += chunk)
                    .on(`error`, err => reject(err))
                    .on(`end`, () => resolve(data));
            });
    });

(async() => {
    for (const url of urls) {
        try {
            // eslint-disable-next-line no-await-in-loop
            const v = await retrieve(url);
            console.log(v);
        } catch (err) {
            console.error(`Error : ${ err }`);
        }
    }
})();