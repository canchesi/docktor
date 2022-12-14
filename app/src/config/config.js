var config = {
    development: {
        database: {
            host: process.env.DB_HOST_DEV,
            port: process.env.DB_PORT_DEV,
            user: process.env.DB_USER_DEV,
            password: process.env.DB_PASS_DEV,
            database: process.env.DB_NAME_DEV,
            dialect: process.env.DB_DIAL_DEV
        },
        port: process.env.PORT_DEV,
        key_path: process.env.KEY_PATH_DEV,
        cert_path: process.env.CERT_PATH_DEV,
        token: process.env.TOKEN_KEY_DEV
    },
    production: {
        database: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            dialect: process.env.DB_DIAL
        },
        port: process.env.PORT,
        key_path: process.env.KEY_PATH,
        cert_path: process.env.CERT_PATH,
        token: process.env.TOKEN_KEY
    }
}

module.exports = config;