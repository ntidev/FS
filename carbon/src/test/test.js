const config = require('../config/config');
const chai = require('chai');
const chaiHttp = require('chai-http');
const path = require('path');
const fs = require('fs');
const server = require('../index');
chai.use(chaiHttp);

let should = chai.should();

// Application credentials for testing
const app = {
    app_name: '_ntifs_test',
    auth_key: 'xyz'
};

// Create file to be used for testing
const file = {
    path: '/test.txt'
};
const dir = path.dirname(config.files.root_dir + app.app_name + file.path);
if(!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}
fs.writeFileSync(config.files.root_dir + app.app_name + file.path, "test");

// After test cleanups
let remainingTests = 3;
let cleanup = function() {
    remainingTests--;
    if(remainingTests > 0) return;
    fs.unlinkSync(config.files.root_dir + app.app_name + file.path);
    fs.rmdirSync(dir);
};

// Test the file registration
describe('/POST file/register', () => {
    it('it should register a new file entry', (done) => {
        chai.request(server)
            .post('/file/register')
            .auth(app.app_name, app.auth_key)
            .send(file)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                cleanup();
                done();
            });
    })
});

// Test the token generation for the file
describe('/POST token/generate', () => {
    it('it should generate a token for a file', (done) => {
        chai.request(server)
            .post('/token/generate')
            .auth(app.app_name, app.auth_key)
            .send(file)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                cleanup();
                done();
            });
    })
});

// Test the download of a token
describe('/GET token/:token/download', () => {
    it('it should generate a token for a file', (done) => {
        chai.request(server)
            .post('/token/generate')
            .auth(app.app_name, app.auth_key)
            .send(file)
            .end((err, res) => {
                chai.request(server)
                    .get('/token/'+res.body.token+'/download')
                    .auth(app.app_name, app.auth_key)
                    .send(file)
                    .end((err, res) => {
                        res.should.have.status(200);
                        cleanup();
                        done();
                    });
            });
    })
});