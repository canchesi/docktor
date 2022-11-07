const http = require('http');
const createPath = require('./query');


const request = async (params) => {

    var { path, req } = params;
    path = createPath(path, req.query);
    const { 'content-type': contentType, ...headers } = req.headers;

    const options = {
        socketPath: '/run/docker.sock',
        path: path,
        method: req.method,
        verbose: true,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        body: req.body,
        query: req.query
    };

    const makeRequest = () => {
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

            req.end();
        });
    }
    
    return await makeRequest();
     
}

module.exports = request;