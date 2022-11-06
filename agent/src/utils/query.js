const createPath = (path, query) => {
    let result = path;
    if (query) {
        result += '?';
        for (let key in query)
            result += `${key}=${query[key]}&`;
        result = result.slice(0, -1);
    }
    return result;
}

module.exports = createPath;