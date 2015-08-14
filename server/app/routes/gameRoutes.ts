/// <reference path="../_all.ts"/>

import express = require('express');

export function Router() {

    var router: express.Router = express.Router();
    var games = require('../controller/gameController');

    //router.all('/*', security.handleAuthenticate)
    router.get('/getGame', games.getGame);
    router.post('/initGame', games.initGame);
    router.post('/doMove', games.doMove);

    return router;
}

