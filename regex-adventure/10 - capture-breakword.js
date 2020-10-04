'use strict';

module.exports = s => {
    const m = /\bx=(?<numbers>\d+)\b/u.exec(s);

    return m ? m.groups.numbers : m;
};