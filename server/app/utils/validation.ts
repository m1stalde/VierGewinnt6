/// <reference path="../_all.ts"/>
'use strict';

var userNameRegExp = new RegExp('^[a-zA-Z0-9]{3,15}$');

export function isUserNameValid(userName: string): boolean {
    return userNameRegExp.test(userName);
}
