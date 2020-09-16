'use strict';

const
    {Transform} = require(`stream`),
    http = require(`http`),
    port = process.argv[2];

class uppercazer extends Transform {
    _transform(chunk, encoding, callback) {
        this.push(typeof chunk === `string` ? chunk.toUpperCase() : chunk.toString().toUpperCase());
        callback();
    }
}

const
    upper = new uppercazer(),
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