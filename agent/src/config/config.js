var config = {
    development: {
        database: {
            host: process.env.DB_HOST_DEV,
            port: process.env.DB_PORT_DEV,
            user: process.env.DB_USER_DEV,
            password: process.env.DB_PASS_DEV,
            database: process.env.DB_DATABASE_DEV
        }
    },
    production: {
        database: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        }
    }
}