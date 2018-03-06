const config = require('../../config/config');
const tokenRepository = require('../../repositories/token');
const fileRepository = require('../../repositories/file');
const uuidv4 = require('uuid/v4');
const fs = require('fs');

module.exports = {

    generate: (file, user, callback) => {

        if(!file || !file.path) {
            callback(null, "The Path is required.");
            return;
        }

        fileRepository.findOneByPath(file.path, (file) => {

            if(!file) {
                callback(null, "The File entry was not found.");
                return;
            } else {
                const fileExists = fs.existsSync(file.path);

                if(!fileExists) {
                    callback(null, "The File was not found.");
                    return;
                } else {
                    const uuid = uuidv4();
                    const token = {
                        token: uuid,
                        file_uuid: file.uuid,
                        expires: Math.round((Date.now() / 1000)) + 3600, // 1 hour
                        application: user.app_name,
                        download_url: config.base_url + "token/" + uuid + "/download"
                    };
                    tokenRepository.create(token, (t) => { callback(t) });
                }
            }
        });
    }

};