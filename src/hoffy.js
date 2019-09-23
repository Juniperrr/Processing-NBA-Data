var fs = require("fs");

function sum(num1, num2, ... numn) {
    if (num1 === undefined) { //No argument
        return 0;
    }
    else if (num1 !== undefined) { //num1 + ?
        if (num2 === undefined) { //num1
            return num1;
        }
        else {                  //num1 + num2. num1 + num2 + ?
            if (numn === undefined){ //num1 + num2
                return num1 + num2;
            }
            else {                  //num1 + num2 + numn
                return num1 + num2 + numn.reduce((previous, current) => {
                    return previous + current;
                });
            }
        }
    }
}
function callFn(fn, n, arg) {
    if (n == 0) {
        return;
    }
    else {
        fn(arg);
        callFn(fn, n-1, arg);
    }
}

function betterCallFn(fn, n, args1, ... argsn) {
    if (n == 0) {
        return;
    }
    else {
        if (args1 !== undefined) { 
            if (argsn === undefined) { 
                fn(args1, ...argsn);
            }
            else {                      
                fn(args1, ...argsn);
            }
        }
        betterCallFn(fn, n-1, args1, ...argsn);
    }
}

function opposite(oldFn) {
    function newFn(arg) { 
        const ret = !(oldFn(arg));
        return ret;
    }
    return newFn;
}

function bucket(arr, fn) {
    const tru = arr.filter(fn);
    const fal = arr.filter(val => fn(val) === false);
    return [tru,fal];
}

function addPermissions(oldFn) {
    var arg1;
    var args;
    function newFn(arg1, ...args) {
        if ((arg1 !== undefined) && (arg1 !== null)) {
            if (arg1.hasOwnProperty('admin')) {
                if (arg1.admin === true) {
                     return oldFn(...args);
                }
                else {
                    return undefined;
                } 
             }
             else {
                 return undefined;
             }
        }
        else {
            return undefined;
        }
    }
    return newFn;
}

function myReadFile(fileName, successFn, errorFn) {
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) {
            errorFn(err);
        }
        else {
            successFn(data);
        }
    });
}
function readAndExtractWith(extractor) {
    return function(fileName, successFn, errorFn) {
        fs.readFile(fileName, "utf8", (err, data) => {
            if (err) {
                errorFn(err, data);
                return err;
            }
    
            const obj = extractor(data);
            successFn(obj);
        });
    };
}

function rowsToObjects(data) { 
    var headers = data.headers;
    var rows = data.rows; //[[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    var initial = {};
    return rows.map(r => r.reduce((accumulator, currVal, idx) => { //o: , c: 1,2,3, i
        return Object.assign(accumulator, {[headers[idx]]: currVal} )
    },{}));
}

module.exports = {
    sum: sum,
    callFn: callFn,
    betterCallFn: betterCallFn,
    opposite: opposite, 
    bucket: bucket,
    addPermissions: addPermissions,
    myReadFile: myReadFile,
    readAndExtractWith: readAndExtractWith,
    rowsToObjects: rowsToObjects,
}