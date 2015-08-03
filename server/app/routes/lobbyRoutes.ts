/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../../typings/express/express.d.ts"/>

import express = require('express');

export function Router() {

        var router: express.Router = express.Router();
        var ctrl = require('../controller/lobbyController.js');

        //router.get("/*", errorHandler); error handler
        router.get("/", ctrl.LobbyCtrl.retrieveLobbyData);
        router.post("/", ctrl.LobbyCtrl.createNewGame);
        router.delete("/:id", ctrl.LobbyCtrl.retrieveLobbyData);

        return router;
}
