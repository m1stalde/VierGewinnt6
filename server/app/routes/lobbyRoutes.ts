/// <reference path="../_all.ts"/>

import express = require('express');
import controller = require('../controller/lobbyController');

var router: express.Router = express.Router();

//router.get("/*", errorHandler); error handler
router.get("/", controller.retrieveLobbyData);
router.post("/", controller.createNewGame);
router.delete("/:id", controller.retrieveLobbyData);

export = router;
