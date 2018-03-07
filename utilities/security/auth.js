const config = require('../../config/config');
const auth = require('basic-auth');
const applicationRepository = require('../../repositories/application');
const _debug_auth = require('debug')(config.debug.AUTH);
const _debug_request = require('debug')(config.debug.REQUEST);
const requestIp = require('request-ip');
let clientIp = '';

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
            if(errors) {
                _debug_auth('Authentication errors:');
                _debug_auth(errors);
            }
            res.statusCode = 401;
            res.setHeader('WWW-Authenticate', 'Basic realm="example"');
            _debug_auth('Access denied for ' + JSON.stringify(credentials) + ' from ' + clientIp);
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
        app.use((req, res, next) => {
            clientIp = requestIp.getClientIp(req);
            _debug_request({
                method: req.method,
                body: req.body,
                params: req.params,
                path: req.path,
                protocol: req.protocol,
                clientIp: clientIp,
                query: req.query,
            });
            _http_basic_auth(req, res, next);
        });
    }
};
