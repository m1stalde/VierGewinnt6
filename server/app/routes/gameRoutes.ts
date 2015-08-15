/// <reference path="../_all.ts"/>

import express = require('express');
import gameController = require('../controller/gameController');

var router: express.Router = express.Router();

//router.all('/*', security.handleAuthenticate)
router.get('/getGame', gameController.getGame);
router.post('/newGame', gameController.newGame);
router.post('/doMove', gameController.doMove);

export = router;