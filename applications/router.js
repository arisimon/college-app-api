'use strict';

const express = require('express');
const config = require('../config');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlParser = bodyParser.urlencoded({ extended: true });
const mongoose = require('mongoose');
const router = express.Router();
const { Applications } = require('./models');
const passport = require('passport');


//set up router parsing
router.use(jsonParser);
router.use(urlParser);

//Authentication
const { localStrategy, jwtStrategy } = require('../auth/strategies');

passport.use('local', localStrategy);
passport.use(jwtStrategy);

//GET request for all applications
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log('GETting all applications')
    Applications
        .find()
        .exec()
        .then(applications => {
            res.status(200).json(applications)
        })
        .catch(err => {
            res.status(500).json({ message: 'Internal server error' });
        })
});





module.exports = { router };