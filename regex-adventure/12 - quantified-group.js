'use strict';

// eslint-disable-next-line prefer-named-capture-group
module.exports = s => /^(0x[0-9a-fA-F]{2}\s+){8}$/u.test(s);