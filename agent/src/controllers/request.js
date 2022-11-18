const http = require('http');
const createPath = require('../utils/query');

const request = async (req, res) => {

    const body = JSON.stringify(req.body);
    const options = {
        socketPath: '/run/docker.sock',
        path: createPath(req.originalUrl.replace('/api', ''), req.query),
        method: req.method,
        verbose: true,
        headers: req.method === 'POST' || req.method === 'PUT' ? {
            ...req.headers,
            'content-type': 'application/json',
            'content-length': Buffer.byteLength(body)
        } : req.headers
    };

    const returnResponse = (response) => {

        let result = {
            statusCode: response.statusCode,
            data: ''
        }

        response.on('data', (chunk) => {
            result.data += chunk;
        });

        response.on('end', () => {
            res.status(result.statusCode).send(result.data);    
        });

    }

    const dockerRequest = http.request(options, returnResponse)
    dockerRequest.write(body || '');
    dockerRequest.end();

}

module.exports = request;