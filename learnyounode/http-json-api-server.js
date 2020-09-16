/* eslint-disable multiline-comment-style */
'use strict';

const
    http = require(`http`),
    port = process.argv[2],
    srv = http.createServer((req, res) => {

        if (req.method === `GET`) {

            const
                url = new URL(req.url, `https://example.org/`),
                {pathname, search} = url,
                iso = search.match(/(?<=\?iso=)[0-9-T:.Z]+/u);

            if (iso === null)
                res.end(`invalid ISO date`);

            const d = new Date(iso[0]);

            if (pathname === `/api/parsetime`) {
                res.writeHead(200, {'Content-Type': `application/json`});
                res.end(JSON.stringify({
                    hour: d.getHours(),
                    minute: d.getMinutes(),
                    second: d.getSeconds()
                }));
            } else if (pathname === `/api/unixtime`) {
                res.writeHead(200, {'Content-Type': `application/json`});
                res.end(JSON.stringify({
                    unixtime: d.getTime()
                }));
            } else {
                res.writeHead(404);
                res.end(`invalid API call`);
            }

        } else {
            res.writeHead(404);
            res.end(`only GET please`);
        }

    });

srv.listen(port);