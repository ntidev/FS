const auth = require('basic-auth');
const applicationRepository = require('../../repositories/application');

/**
 * List of Public Routes regex expressions
 *
 * @type {string[]}
 * @private
 */
let _public_routes = [
    "\\/token\\/[0-9-\\w]+\\/download", // /token/:token/download
];

/**
 * Basic HTTP Authentication
 *
 * @param req
 * @param res
 * @param next
 * @private
 */
let _http_basic_auth = (req, res, next) => {

    let isPublic = false;
    _public_routes.forEach((regex) => {
        if(req.path.match(regex) !== null) {
            next();
            isPublic = true;
        }
    });
    if(isPublic) {
        return;
    }

    const credentials = auth(req);
    applicationRepository.findOneByCredentials(credentials, (user, errors) => {
        if(!user || errors) {
            res.statusCode = 401;
            res.setHeader('WWW-Authenticate', 'Basic realm="example"');
            console.log("Invalid Login");
            res.end('Access denied');
            return;
        }
        req._user = user;
        next();
    });
};



/**
 * Secure Routes definition
 * @type {{secure: function(*)}}
 */
module.exports = {
    secure: (app) => {
        app.use((req, res, next) => _http_basic_auth(req, res, next));
    }
};
