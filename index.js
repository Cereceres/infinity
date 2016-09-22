'use strict';
module.exports  = function (il) {
    return new Promise(function(resolve, reject) {
        let stopped = false;
        let res
        let stop = function (error) {
            stopped = true;
            if(error) return reject(error);
            resolve(res);
        };
        let tried = function () {
            try {
                res = il(stop);
                if(!stopped) setImmediate(tried,res);
            } catch (err) {
                reject(err);
            }
        };
        setImmediate(tried,res);
    });
};
