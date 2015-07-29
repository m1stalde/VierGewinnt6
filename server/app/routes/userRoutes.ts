/// <reference path="../../typings/node/node.d.ts"/>
/// <reference path="../../typings/express/express.d.ts"/>

import express = require('express');

export function Router() {

    var router: express.Router = express.Router();
    var users = require('../controller/userController.js');

    router.get("/", users.getUsers);
    router.post("/", users.registerUser);

    return router;
}

