/// <reference path="../_all.ts"/>

import express = require('express');
import controller = require('../controller/gameController');
import security = require('../utils/security');

var router: express.Router = express.Router();

//router.all('/*', security.handleAuthenticate);
router.get('/:id', controller.getGame);
router.post('/', controller.newGame);
router.post('/:id/move/:col', controller.doMove);
router.post('/:id/restart', controller.restartGame);
router.post('/:id/break', controller.breakGame);

export = router;