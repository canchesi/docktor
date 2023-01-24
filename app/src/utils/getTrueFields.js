
// Gestisce query di filtro per le api
const getTrueFields = (obj) => {
    var fields = [];
    Object.keys(obj).forEach((key) => {
        if (Boolean(obj[key]) == true)
            fields.push(key);
    })
    return fields.length ? fields : null;
}

module.exports = getTrueFields;