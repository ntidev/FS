const database = require('../utilities/database/database');

module.exports = {
    /**
     * Get an Application from the given credentials
     * @param credentials
     * @param callback
     */
	findOneByCredentials: (credentials, callback) => {
		if(!credentials || !credentials.name || !credentials.pass) {
			callback(null);
			return;
		}
        database.query("SELECT * FROM application WHERE app_name = ? AND auth_key = ? LIMIT 1", [credentials.name, credentials.pass], (results, errors) => {
        	if(errors) {
                callback(null, errors);
			} else {
        		callback(results[0]);
			}
		});
	}
};