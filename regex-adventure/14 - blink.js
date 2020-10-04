'use strict';

const marked = require(`marked`);

module.exports = s => marked(s).replace(/@@(?<content>.+?)@@/gu, `<blink>$<content></blink>`);