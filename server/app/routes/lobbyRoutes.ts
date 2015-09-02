/// <reference path="../_all.ts"/>

import express = require('express');
import controller = require("../controller/lobbyController");
import security = require("../utils/security");

var router: express.Router = express.Router();

router.all('/*', security.handleAuthenticate);
router.get("/", controller.retrieveLobbyData);
router.post("/", controller.saveRoom);
router.get("/:id", controller.retrieveRoom);
router.post("/:id", controller.joinRoom);

export = router;
