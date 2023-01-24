
// Controlla se tutti i campi sono valorizzati
const checkAllFields = (fields) => {
    if (!(fields instanceof Array))
        throw new Error("checkAllFields: fields must be an array");
    return fields.every((field) => {
        return field != undefined && field != null && field != "";
    });
}

module.exports = checkAllFields;