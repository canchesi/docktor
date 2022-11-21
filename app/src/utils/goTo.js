const { join } = require('path');

const goTo = (page, status) => (req, res) => {
    res.status(status || 200).sendFile(join(__dirname, `../views/${page}.html`));
}

module.exports = goTo;