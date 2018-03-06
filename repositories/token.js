const database = require('../utilities/database/database');

module.exports = {
    /**
     *  Create a new token
     * @param token
     * @param callback
     */
	create: (token, callback) => {

        const sql = "INSERT INTO token (token, file_uuid, expires, application, download_url) VALUES (?, ?, ?, ?, ?)";
		database.query(sql, [token.token, token.file_uuid, token.expires, token.application, token.download_url], (results) => {
			if(callback) {
                callback(token);
			}
		});
	},

    /**
     * Find a token object for the given token
     *
     * @param tokenString
     * @param callback
     */
	findByToken: (tokenString, callback) => {
        const sql = "SELECT * FROM token t WHERE t.token = ? LIMIT 1";
        database.query(sql, [tokenString], (results) => {
        	callback(results[0]);
		});
	},

    /**
     * Find a File for the given token
     *
     * @param token
     * @param callback
     */
	findFileByToken: (token, callback) => {
		const sql = "SELECT * FROM file f INNER JOIN token t ON t.file_uuid = f.uuid AND t.token = ? LIMIT 1";
		database.query(sql, [token], (results) => {
			callback(results[0]);
		});
	}
};