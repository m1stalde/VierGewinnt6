/// <reference path="../_all.ts"/>
'use strict';

class CustomError implements Error {
    name: string;
    message: string;

    constructor(name, message) {
        this.name = name;
        this.message = message;
    }

    toString(): string {
        return this.name + this.message;
    }
}

export class NotFoundError extends CustomError {
    constructor(message) {
        super('NotFoundError', message);
    }
}