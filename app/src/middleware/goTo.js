const goTo = (page, condition, redirect) => (req, res) => {
    if (condition)
        res.status(200).sendFile(page);
    else
        res.redirect(303, redirect || '/')
}

module.exports = goTo;