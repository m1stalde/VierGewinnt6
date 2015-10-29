/// <reference path="../_all.ts"/>

import express = require('express');
import controller = require('../controller/gameController');
import security = require('../utils/security');

var router: express.Router = express.Router();

//router.all('/*', security.handleAuthenticate);
router.get('/getGame', controller.getGame);
router.post('/newGame', controller.newGame);
router.post('/doMove', controller.doMove);
router.post('/restartGame', controller.restartGame);
router.post('/breakGame', controller.breakGame);

export = router;