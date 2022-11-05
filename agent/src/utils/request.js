const http = require('http');


const request = async (path, method) => {
    
    const options = {
        socketPath: '/run/docker.sock',
        path: path,
        method: method,
        verbose: true,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const makeRequest = () => {
        return new Promise((resolve, reject) => {
            const req = http.request(options, (res) => {
                let result = {
                    statusCode: res.statusCode,
                    data: ''
                };

                res.on('data', (chunk) => {
                    result.data += chunk;
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

//console.log(request('/images/json', 'GET'));

module.exports = request;