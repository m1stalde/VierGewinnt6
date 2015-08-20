/// <reference path="../_all.ts"/>

export class Utils{

    // Create a 128 bit guid
    static createGuidcreateGuid = function () : string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    }

    static propertyValidator(obj){
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
}
