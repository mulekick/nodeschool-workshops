/* eslint-disable id-denylist */
'use strict';

const
    fs = require(`fs`),
    [ dp, fe ] = process.argv.slice(2, 4),
    rd = (path, ext) => new Promise((resolve, reject) => {
        fs.readdir(path, `utf8`, (err, list) => {
            const rg = new RegExp(`(\\.${ ext })$`, `u`);
            err ? reject(err) : resolve(list.filter(x => rg.test(x)));
        });
    });

(async() => {

    let v = null;

    try {
        v = await rd(dp, fe);
    } catch (err) {
        v = `stuff happens : ${ [ JSON.stringify(err) ] }`;
    } finally {
        for (const f of v)
            console.log(f);
    }

})();