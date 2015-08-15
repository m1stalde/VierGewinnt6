/// <reference path="../_all.ts"/>

import express = require('express');
import controller = require('../controller/userController');

var router: express.Router = express.Router();

//router.all('/*', security.handleAuthenticate)
router.get('/', controller.getCurrentUser);
router.put(',', controller.updateCurrentUser);

export = router;

