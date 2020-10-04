'use strict';

const
    {uppercazer} = require(`./stream-lib`),
    http = require(`http`),
    port = process.argv[2];

const
    upper = new uppercazer({decodeStrings: true, defaultEncoding: `utf8`, objectMode: false}),
    srv = http.createServer((req, res) => {

        if (req.method === `POST`) {
            req
                .pipe(upper)
                .pipe(res);
        } else {
            res.writeHead(404);
            res.end(`only POST please`);
        }

    });

srv.listen(port);