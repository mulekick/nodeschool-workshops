'use strict';

const
    {Transform} = require(`stream`),
    http = require(`http`),
    port = process.argv[2];

class uppercazer extends Transform {
    // eslint-disable-next-line no-useless-constructor
    constructor(options) {
        super(options);
    }

    _transform(chunk, encoding, callback) {
        this.push(typeof chunk === `string` ? chunk.toUpperCase() : chunk.toString(`utf8`).toUpperCase());
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