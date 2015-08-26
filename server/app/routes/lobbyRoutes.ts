/// <reference path="../_all.ts"/>

import express = require('express');
var path = require("path");

var controller = require(path.join(__dirname, '..', 'controller', 'lobbyController.js'));
//import controller = require('../controller/lobbyController');
var security = require(path.join(__dirname, '..', 'utils', 'security.js'));

var router: express.Router = express.Router();

router.all('/*', security.handleAuthenticate);
router.get("/", controller.retrieveLobbyData);
router.post("/", controller.createNewRoom);
router.get("/:id", controller.retrieveRoom);
router.post("/:id", controller.joinRoom);

export = router;
