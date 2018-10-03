const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { Applications } = require('../applications/models');
const { Colleges } = require('../colleges/models');
const { User } = require('../users/models');
const { app, runServer, closeServer } = require('../server');
const { JWT_EXPIRY, JWT_SECRET, TEST_DATABASE_URL, PORT } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

//seed species database
function generateColleges() {
    return {
        // web_pages: faker.name.url(),
        alpha_two_code: faker.name.firstName(),
        state_province: faker.name.lastName(),
        country: faker.name.firstName()
    }
}


function seedCollegeData() {
    const seedData = [];
    for(let i = 0; i < 5; i++) {
        seedData.push(generateColleges());
    }
    return Colleges.insertMany(seedData);
}



function tearDownDb() {
    return new Promise((resolve, reject) => {
        console.warn("Deleting test database");
        mongoose.connection
            .dropDatabase()
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}


describe('College Database testing', function() {

    const username = 'user';
    const password = 'password';
    let firstName = '';
    let lastName = ''

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        seedCollegeData();
    });

    beforeEach(function() {
        return User.hashPassword(password).then(password =>
            User.create({
                username,
                password
            })
        );
    });

    afterEach(function() {
        return User.remove({});
    });

    afterEach(function() {
        return tearDownDb();
    });

    after(function() {
        return closeServer();
    });

    describe('Colleges GET endpoint', function() {
        const token = jwt.sign({
                user: {
                    username,
                }
            },
            JWT_SECRET, {
                algorithm: 'HS256',
                subject: username,
                expiresIn: '7d'
            }
        );
        it('should GET all colleges', function(done) {
            chai.request(app)
                .get('/api/colleges')
                .set('authorization', `Bearer ${token}`)
                .end(function(err, res) {
                    console.log(res.body);
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.a('array');
                    expect(res.body[0]).to.have.property('web_pages');
                    expect(res.body[0]).to.have.property('name');
                    expect(res.body[0]).to.have.property('alpha_two_code');
                    expect(res.body[0]).to.have.property('state_province');
                    expect(res.body[0]).to.have.property('country');
                    done();
                });
        });

    });
});