const { join } = require('path');

const goTo = (page, status) => (req, res) => {
    res.status(status || 200).sendFile(join(__dirname, `../public/${page}.html`));
}

module.exports = goTo;