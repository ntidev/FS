const config = require('../config/config');
const express = require('express');
const router = express.Router();
const path = require('path');
const {checkSchema, validationResult} = require('express-validator/check');
const fileRepository = require('../repositories/file');
const fileValidator = require('../validators/file/file');
const tokenGenerator = require('../services/token/token-generator');

/**
 * Register a new File entry in the database
 */
router.post('/register', checkSchema(fileValidator), (req, res) => {

    const user = req._user;

    const errors = validationResult(req);

    if (errors.isEmpty()) {

        let filePath = req.body.path;

        filePath = config.files.root_dir + path.sep + user.app_name + path.sep + path.normalize(filePath);

        let createToken = (file) => {
            tokenGenerator.generate(file, user, (token, error) => {
                if (error) {
                    return res.status(400).json({error: error});
                } else {
                    return res.status(201).json(token);
                }
            });
        };

        fileRepository.findOneByPath(filePath, (file) => {
            if (!file) {
                fileRepository.create({path: filePath}, user, (file, errors) => {
                    if(errors) {
                        return res.status(500).json({errors: errors});
                    }
                    createToken(file);
                });
            } else {
                createToken(file);
            }
        });

    } else {
        return res.status(422).json({errors: errors.mapped()});
    }

});

module.exports = router;