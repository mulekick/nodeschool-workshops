/* eslint-disable id-denylist */
'use strict';

const
    http = require(`http`),
    fs = require(`fs`),
    [ port, path ] = process.argv.slice(2, 4),
    srv = http.createServer((req, res) => {
        res.writeHead(200, {'Content-Type': `text/plain`});

        const streamreadfile = fs.createReadStream(path);
        streamreadfile
            .on(`data`, chunk => res.write(chunk))
            .on(`end`, () => res.end())
            .on(`error`, err => res.end(console.error(`Error : ${ err }`)));

    });

srv.listen(port);