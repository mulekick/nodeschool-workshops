'use strict';

const
    {uppercazer} = require(`./stream-lib`),
    upper = new uppercazer({decodeStrings: true, defaultEncoding: `utf8`, objectMode: false}),
    http = require(`http`),
    port = process.argv[2],
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