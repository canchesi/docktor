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
        passphrase_path: process.env.PASSPHRASE_PATH_DEV,
        token: process.env.TOKEN_KEY_DEV,
    },
    production: {
        database: {
            host: process.env.DB_HOST,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        },
        port: process.env.PORT,
        token: process.env.TOKEN_KEY
    }
}

module.exports = config;