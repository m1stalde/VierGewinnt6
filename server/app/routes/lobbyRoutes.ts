/// <reference path="../_all.ts"/>

import express = require('express');
import controller = require("../controller/lobbyController");
import security = require("../utils/security");

var router: express.Router = express.Router();

router.all('/*', security.handleAuthenticate);
router.get("/", controller.getAllRooms);
router.get("/:id", controller.getRoom);
router.post("/", controller.saveRoom);

export = router;
