var config = {
    development: {
        database: {
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'root',
            database: ''
        }
    },
    production: {
        database: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        }
    }
}