const config = require('../config/config');
const express = require('express');
const router = express.Router();
const path = require('path');
const tokenRepository = require('../repositories/token');
const tokenGenerator = require('../services/token/token-generator');

/**
 * Generates a new token for the given Path
 */
router.post('/generate', (req, res) => {
	const user = req._user;
    const filePath = config.files.root_dir + user.app_name + path.normalize(req.body.path);
	const file = {path: filePath};

    tokenGenerator.generate(file, user, (token, error) => {
        if(error) {
            return res.status(400).json({ error: error});
        } else {
            return res.status(201).json(token);
        }
    });
});

/**
 * Download a File from a given token
 */
router.get("/:token/download", (req, res) => {
    tokenRepository.findByToken(req.params.token, (token) => {
        if(!token) {
            return res.status(404).json({ error: "The token was not found."});
        }

        if(token.expires < Math.round(Date.now() / 1000)) {
            return res.status(400).json({ error: "This token is already expired."});
        }

        tokenRepository.findFileByToken(req.params.token, (file) => {
            res.download(file.path);
        });
    });
});

module.exports = router;