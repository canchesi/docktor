const sendError = (error, res) => {
    if (error.original && error.original.hasOwnProperty('errno')) 
        switch (error.original.errno) {
            case 1054:
                res.status(400).send("Campo non valido");
                return;
            case 1142:
                res.status(401).send("Non hai i permessi per eseguire questa operazione");
                return;
        }
    else if (error.message)
        switch (error.message) {
            case "Non puoi cancellare l'utente di default":
                res.status(401).send("Non puoi cancellare l'utente di default");
                return;
        }
    res.status(501).send("Errore durante l'operazione");
}

module.exports = sendError;