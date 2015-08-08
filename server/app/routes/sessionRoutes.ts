/// <reference path="../_all.ts"/>

import express = require('express');

export function Router() {

    var router: express.Router = express.Router();
    var session = require('../controller/sessionController');

    router.get("/login", session.isLoggedIn);
    router.post("/login", session.login);
    router.post("/logout", session.logout);

    return router;
}

