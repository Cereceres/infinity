'use strict';
module.exports  = function (il, arg) {
    return new Promise(function(resolve, reject) {
        let stopped = false;
        let stop = function (error,res) {
            if(stopped) return
            stopped = true;
            if(error) return reject(error);
            resolve(res);
        };
        let next = function (pass) {
            if(stopped) return
            if(!stopped && pass && typeof pass.then === 'function') return pass.then(_res=>setImmediate(tried,_res))
            if(!stopped) setImmediate(tried,pass)
        }
        let tried = function (pass) {
            try {
                if(!stopped && pass && typeof pass.then === 'function') return pass.then(_res=>setImmediate(tried,_res))
                il(next,stop,pass);
            } catch (err) {
                reject(err);
            }
        };
        setImmediate(tried ,arg);
    });
};
