const http = require('http');

// Converte la richiesta http in una richiesta http verso la socket di docker
const request = async (req, res) => {

    // Converte il body della richiesta in una stringa
    const body = JSON.stringify(req.body);

    // Opzioni della richiesta
    const options = {
        socketPath: '/run/docker.sock',
        path: req.originalUrl.replace('/api',''),
        method: req.method,
        verbose: true,
        headers: req.method === 'POST' || req.method === 'PUT' ? {
            ...req.headers,
            'content-type': 'application/json',
            'content-length': Buffer.byteLength(body)
        } : req.headers
    };

    // Funzione che ritorna la risposta
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

    // Prepara la richiesta
    const dockerRequest = http.request(options, returnResponse)

    // Scrive il body della richiesta
    dockerRequest.write(body || '');

    // Chiude la richiesta
    dockerRequest.end();

}

module.exports = request;