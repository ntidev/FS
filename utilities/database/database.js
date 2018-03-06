const config = require('../../config/config');
const mysql = require('mysql');

module.exports = {
	query: (sql, params, callback) => {
        const connection = mysql.createConnection(config.database);
		connection.connect();
		connection.query(sql, params, function(errors, results, fields) {
			if(errors)
				callback(null, errors);
			else
			    callback(results);
		});
		connection.end();
	},
};


