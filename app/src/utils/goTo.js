const goTo = (status) => (req, res) => {
    res.redirect(307, page);
}

module.exports = goTo;