const checkAllFields = (fields) => {
    if (!(fields instanceof Array))
        throw new Error("checkAllFields: fields must be an array");
    fields.forEach((field) => {
        if (!field.value)
            return false
    });
    return true
}

module.exports = checkAllFields;