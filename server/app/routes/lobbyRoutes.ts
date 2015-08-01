/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../../typings/express/express.d.ts"/>

import express = require('express');

export function Router() {

        var router: express.Router = express.Router();
        var lobby = require('../controller/lobbyController.js');

        router.get("/", lobby.A);
        router.post("/", lobby.B);

        return router;
}
