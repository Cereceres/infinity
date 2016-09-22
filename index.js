'use strict';
/**
* public API infinity that can be called infinity times
* @function infinity
* @param {infinityCB} cb - will be exec every times that the next is called
* @param {object} arg - argument to be passed to callback
* @return {promise} primise to be resolved  when stop is called
*/

/**
* this function is called every time the next is called
* @callback infinityCB
* @param {next} cb - to be called to do next loop.
* @param {stop} cb - to be called to stop loop.
* @param {Object} arg - to be catched from params passed to next callback
* @return {Object} val - this value is not catched
*/

/**
* this function called the infinityCB callback
* @callback next
* @param {object} arg - to be passed like third argument to infinityCB
*                       if is a promise, the next loop is called until be resolved  
                        and infinityCB is called with resolution value.
* @return {object} val - null
*/

/**
* when this callback is called the loop is stopped and the promise returned by
* infinity function resolved or reject.
* @callback stop
* @param {object} err - if this is different of null the promise is rejected.
* @param {object} vale - value used to resolve the promise
* @return {object} val - null
*/
module.exports  = function (il, arg) {
    return new Promise(function(resolve, reject) {
        //**the stop callback*
        let stopped = false;
        let stop = function (error,res) {
            if(stopped) return
            stopped = true;
            if(error) return reject(error);
            resolve(res);
        };
        /**the next callback*/
        let next = function (pass) {
            if(stopped) return
            if(!stopped && pass && typeof pass.then === 'function') return pass.then(_res=>setImmediate(tried,_res))
            if(!stopped) setImmediate(tried,pass)
        }
        /**callback to do infinity loop*/
        let tried = function (pass) {
            try {
                il(next,stop,pass);
            } catch (err) {
                reject(err);
            }
        };
        setImmediate(tried ,arg);
    });
};
