module.exports = {
    host: process.env.NTIFS_HTTP_HOST,
    host_port: process.env.NTIFS_HTTP_PORT,
    base_url: process.env.NTIFS_BASE_URL,
    files: {
        root_dir: process.env.NTIFS_FILES_ROOT,
    },
    database: {
        host: process.env.NTIFS_DB_HOST,
        port: process.env.NTIFS_DB_PORT,
        user: process.env.NTIFS_DB_USER,
        password: process.env.NTIFS_DB_PASSWORD,
        database: process.env.NTIFS_DB_NAME,
    },
    debug: {
        AUTH: 'auth',
        REQUEST: 'request',
    }
};