const database = require('../utilities/database/database');
const uuidv4 = require('uuid/v4');
const fs = require('fs');
const path = require('path');

module.exports = {

    /**
     * Creates a new File
     * @param file
     * @param user
     */
	create: (file, user, callback) => {

		if(!file || !file.path) {
            callback(null, "The Path is required.");
            return;
        }

		if(!fs.existsSync(file.path)) {
			callback(null, "The file " + file.path + " does not exists.");
			return;
		}

		const stats = fs.statSync(file.path);

        file.size = stats.size;
        file.filename = path.basename(file.path);
        file.format = path.extname(file.path);
        module.exports.findOneByPath(file.path, (match, errors) => {
			if(match) {
                callback(file, errors);
			} else {
                file.uuid = uuidv4();
                const sql = "INSERT INTO file (uuid, path, filename, size, format) VALUES (?, ?, ?, ?, ?)";
                database.query(sql, [file.uuid, file.path, file.filename, file.size, file.format], (results) => {
                    callback(file, errors);
                });
			}
		});

	},

    /**
	 * Get's one File by `path`
     * @param path
     */
	findOneByPath: (path, callback) => {

        database.query("SELECT * FROM file WHERE path = ? LIMIT 1", [path], (results, errors) => {
        	if(errors) {
        		callback(null, errors);
			} else {
                callback(results[0]);
			}
		});
	}
};