/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../../typings/express/express.d.ts"/>

import express = require('express');

export function Router() {

        var router: express.Router = express.Router();
        var lobby = require('../controller/lobbyController.js');

        //router.get("/*", errorHandler); error handler
        router.get("/", lobby.retrieveLobbyData);
        router.post("/", lobby.createNewGame);
        router.delete("/:id", lobby.deleteGame);

        return router;
}
