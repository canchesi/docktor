const getTrueFields = (obj) => {
    var fields = [];
    Object.keys(obj).forEach((key) => {
        console.log(key);
        if (obj[key] == true)
            fields.push(key);
    })
    return fields;
}

module.exports = getTrueFields;