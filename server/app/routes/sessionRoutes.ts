/// <reference path="../_all.ts"/>

import express = require('express');

export function Router() {

    var router: express.Router = express.Router();
    var users = require('../controller/sessionController');

    router.get("/login", users.isLoggedIn);
    router.post("/login", users.login);
    router.post("/logout", users.logout);

    return router;
}

