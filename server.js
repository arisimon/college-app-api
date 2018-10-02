'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const passport = require('passport');

//import configuration files/schema
const { PORT, TEST_DATABASE_URL, DATABASE_URL } = require('./config');
const { Applications } = require('./applications/models');
const { Colleges } = require('./colleges/models');
const { User } = require('./users/models');

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const { router: collegesRouter } = require('./colleges');
const { router: applicationsRouter } = require("./applications");

mongoose.Promise = global.Promise;


const app = express();

// Logging
// set morgan to log only 4xx and 5xx responses to console
app.use(
    logger('dev', {
        skip: function(req, res) {
            return res.statusCode < 400;
        }
    })
);

// set morgan to log all requests to access.log
app.use(
    logger('common', {
        stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {
            flags: 'a'
        })
    })
);

//serve static assets
app.use(express.static('public'));

// CORS
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
        return res.send(204);
    }
    next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
app.use('/applications/', applicationsRouter);
app.use('/api/colleges/', collegesRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

//Protected endpoint to test authentication
app.get('/api/protected', jwtAuth, (req, res) => {
    return res.json({
        data: 'found protected endpoint, authentication works'
    });
});

app.use('*', (req, res) => {
    return res.status(404).json({ message: 'URL Not Found' });
});

//serve static assets
app.use(express.static('public'));

let server;

function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(
            databaseUrl,
            err => {
                if (err) {
                    return reject(err);
                }
                server = app
                    .listen(port, () => {
                        console.log(`Your app is listening on port ${port}`);
                        resolve();
                    })
                    .on('error', err => {
                        mongoose.disconnect();
                        reject(err);
                    });
            }
        );
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };