const http = require('http');
const createPath = require('./query');


const request = async (params) => {

    var { path, req } = params;
    const body = JSON.stringify(req.body);

    const options = {
        socketPath: '/run/docker.sock',
        path: createPath(path, req.query),
        method: req.method,
        verbose: true,
        headers: req.method === 'POST' || req.method === 'PUT' ? {
            ...req.headers,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body)
        } : req.headers
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let result = {
                statusCode: res.statusCode,
                data: ''
            };

            res.on('data', (data) => {
                result.data += data;
            });

            res.on('end', () => {
                resolve(result);
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (body)
            req.write(body);
        req.end();
    });
     
}

module.exports = request;