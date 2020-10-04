'use strict';

module.exports = s => {
    const m = /x=(?<numbers>\d+)/u.exec(s);

    return m ? m.groups.numbers : m;
};