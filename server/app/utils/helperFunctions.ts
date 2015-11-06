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

export function getPositionOfElement(array, element, value): number {
    var pos = -1;
    for (var i = 0, len = array.length; i < len; i++) {
        if (array[i][element] == value) pos = i;
    }
    return pos;
}

export function getHighestValue<T>(array : Array<any>, element : string, seed : T) : T{
    var value : T = seed;
    for (var i = 0, len = array.length; i < len; i++) {
        if (array[i][element] > value) {
            value = array[i][element];
        }
    }
    return value;
}

export function getLowestValue<T>(array : Array<any>, element, seed : T) : T{
    var value : T = seed;
    for (var i = 0, len = array.length; i < len; i++) {
        if(i == 0){
            value = array[i][element];
        } else if(array[i][element] < value){
            value = array[i][element];
        }
    }
    return value;
}
