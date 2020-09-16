/* eslint-disable id-denylist */
'use strict';

const
    fs = require(`fs`),
    rd = (path, ext) => new Promise((resolve, reject) => {
        fs.readdir(path, `utf8`, (err, list) => {
            const rg = new RegExp(`(\\.${ ext })$`, `u`);
            err ? reject(err) : resolve(list.filter(x => rg.test(x)));
        });
    }),
    exp = async(dp, fe, cb) => {

        try {
            cb(null, await rd(dp, fe));
        } catch (err) {
            cb(err);
        }

    };
module.exports = exp;