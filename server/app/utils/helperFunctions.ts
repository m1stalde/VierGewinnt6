/// <reference path="../_all.ts"/>
'use strict';

// Create a 128 bit guid
export function createGuid() : string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function propertyValidator(obj){
    var isValid = true;
    for (var property in obj) {
        if (!obj.hasOwnProperty(property) &&
        typeof obj[property] === 'undefined' &&
            !obj[property]) {
            isValid = false;
            break;
        }
    }
    return isValid;
}

export function getPositionOfElement(array, element, value){
    var pos : number = -1;
    for (var i = 0, len = array.length; i < len; i++) {
        if (array[i][element] == value) pos = i;
    }
    return pos;
}
