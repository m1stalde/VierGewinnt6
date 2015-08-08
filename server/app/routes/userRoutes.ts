/// <reference path="../_all.ts"/>

import express = require('express');
var security = require('../utils/security');

export function Router() {

    var router: express.Router = express.Router();
    var users = require('../controller/userController');

    //router.all('/*', security.handleAuthenticate)
    router.get("/", users.getCurrentUser);
    router.put(',', users.updateCurrentUser);

    return router;
}

