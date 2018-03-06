// Configuration
const config = require('./config/config');

// Express JS
const express = require('express');
const app = express();

// Helmet protection
const helmet = require('helmet');
app.use(helmet());

// Prevent Ddos
const Ddos = require('ddos');
const ddos = new Ddos({burst:10, limit:15});
app.use(ddos.express);

// Setup Body Parser
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json

// Handle Authentication
const authenticator = require('./utilities/security/auth.js');
authenticator.secure(app);

// Import Routes
app.use('/token', require("./routes/token"));
app.use('/file', require("./routes/file"));


// Start the Server
app.listen(config.host_port, config.host);
console.log(`Running on http://${config.host}:${config.host_port}`);