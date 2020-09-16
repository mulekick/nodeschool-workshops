/* eslint-disable id-denylist */
'use strict';

const
    fs = require(`fs`),
    fp = process.argv[2],
    rf = path => new Promise((resolve, reject) => {
        fs.readFile(path, `utf8`, (err, content) => {
            err ? reject(err) : resolve(content.match(/\n/gu).length);
        });
    });

(async() => {

    let v = null;

    try {
        v = await rf(fp);
    } catch (err) {
        v = `stuff happens : ${ JSON.stringify(err) }`;
    } finally {
        console.log(v);
    }

})();