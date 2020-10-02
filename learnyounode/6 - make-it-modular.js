/* eslint-disable id-denylist */
'use strict';

const
    exp = require(`./mymodule.js`),
    [ dp, fe ] = process.argv.slice(2, 4);

exp(dp, fe, (err, list) => {
    if (err) {
        console.error(`Error : ${ err }`);
    } else {
        for (const f of list)
            console.log(f);
    }
});