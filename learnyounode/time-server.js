/* eslint-disable id-denylist */
'use strict';

const
    // eslint-disable-next-line prefer-named-capture-group
    fmt = d => `${ d.toISOString().replace(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}).+$/u, `$1 $2`) }\n`,
    net = require(`net`),
    port = process.argv[2],
    srv = net.createServer();

srv
    .on(`error`, err => console.error(`Error : ${ err }`))
    .on(`connection`, s => s.end(fmt(new Date(Date.now() + 2 * 3.6e6)), `utf8`))
    .listen(port);