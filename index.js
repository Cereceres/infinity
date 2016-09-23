'use strict'
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
let infinity = module.exports  = function (il, arg) {
    return new Promise(function(resolve, reject) {
        //**the stop callback*
        let stopped = false
        let res
        let stop = function (error,res) {
            // if stopped is true here is returned
            if(stopped) return
            // the stopped var is setted to true
            stopped = true
            // if error is passed the promise is rejected
            if(error) return reject(error)
            // the promise is resolved
            resolve(res)
        }
        /**the next callback*/
        let next = function (pass) {
            // called is setted to true
            next.called = true
            // if stopped the routune not flowing
            if(stopped) return
            if(!stopped && pass && typeof pass.then === 'function') {
                res = pass.then(_res => next(_res))
                if(typeof res.catch === 'function') res = res.catch(err=>stop(err))
                return
            }
            // is not stopped the loop is called again
            if(!stopped) setImmediate(tried,pass)
        }
        // the default value to called is false
        next.called = false
        /**callback to do infinity loop*/
        let tried = function (pass) {
            try {
                // called value is setted to false
                next.called  = false
                // il is called with next, stop and pass argument passed to next
                res = il(next,stop,pass)
                // if is not called in il, then is called with the return value
                if(!next.called && !infinity.async) next(res)
            } catch (err) {
                // if error is catched the promise is rejected
                reject(err)
            }
        }
        setImmediate(tried ,res || arg)
    })
}
infinity.async= true
