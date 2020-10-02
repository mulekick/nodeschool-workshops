'use strict';

const
    {spawn} = require(`child_process`),
    {aggregator} = require(`./stream-lib`);

module.exports = function(cmd, args) {
    const
        childp = spawn(cmd, args),
        dupl = new aggregator(childp.stdin, childp.stdout);

    return dupl;
};


