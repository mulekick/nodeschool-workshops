/* eslint-disable no-unused-vars */
/* eslint-disable no-return-assign */
'use strict';

const sum = process.argv
    .slice(2)
    // eslint-disable-next-line no-param-reassign
    .reduce((r, x, i, a) => r += Number(x), 0);
console.log(sum);