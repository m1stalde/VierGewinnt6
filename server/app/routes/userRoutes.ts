/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../../typings/express/express.d.ts"/>

import express = require('express');

export function Router() {

    var router: express.Router = express.Router();
    var users = require('../controller/userController');

    router.get("/", users.getUsers);
    router.get("/:id/", users.getUser);
    router.post("/", users.registerUser);

    return router;
}

