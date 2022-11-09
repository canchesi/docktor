const createPath = (path, query) => {
    let result = path + '?';
    for (let key in query)
        result += `${key}=${query[key]}&`;
    return result.slice(0, -1);
}

module.exports = createPath;