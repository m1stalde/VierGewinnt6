/// <reference path="../_all.ts"/>

import express = require('express');
import controller = require('../controller/sessionController');

var router: express.Router = express.Router();

router.get('/login', controller.isLoggedIn);
router.post('/login', controller.login);
router.post('/logout', controller.logout);

export = router;
