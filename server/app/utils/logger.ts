/// <reference path="../_all.ts"/>
'use strict';

export function error(message: string): void {
    console.error(message);
}

export function warn(message: string): void {
    console.warn(message);
}

export function info(message: string): void {
    console.info(message);
}

export function debug(message: string): void {
    console.log(message);
}