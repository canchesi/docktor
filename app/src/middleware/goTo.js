
// Middleware per reindirizzare l'utente su una certa pagina in base a una condizione
const goTo = (page, condition, redirect) => (req, res) => {
    if (condition)
        res.status(200).sendFile(page);
    else
        res.redirect(303, redirect || '/')
}

module.exports = goTo;