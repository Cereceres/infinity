const infinity = require('../index')
const assert = require('assert')
let il = null
describe('test to infinity loop', function () {
    before(function () {
        let counter = 0
        il = function (next,stop) {
            if (counter>10) {
                stop(null,counter)
            }
            counter++
            next()
        }
    })
    it('should return a promise', async() => {
        let res = await infinity(il)
        assert(res>10)
    })

    it('should wait until the promise returned be resolved', async ()=> {
        let counter = 0
        il = function (next,stop,arg) {
            assert(arg==='test')
            if (counter>10) {
                stop(null,counter)
            }
            counter++
            next(Promise.resolve('test'))
        }
        let res = await infinity(il,'test')
        assert(res>10)
    })
    it('should follow the flow when next is not called and async mode is false', async () =>{
        let counter = 0
        il = function (next,stop,arg) {
            assert(arg==='test')
            if (counter>10) {
                stop(null,counter)
            }
            counter++
            return Promise.resolve('test')
        }
        infinity.async = false
        let res = await infinity(il,'test')
        assert(res>10)
    })

    it('should catch the error passed to stop', async () =>{
        il = function (next,stop) {
            stop('error')
        }
        await infinity(il)
        .catch((err) => {
            assert(err==='error')
        })
    })

    it('should catch the error thrown', async () =>{
        il = function () {
            throw new Error('error thrown')
        }
        await infinity(il)
            .catch((err) => {
                assert(err.message==='error thrown')
            })
    })

    it('should return a promise rejected if a promise rejected is passed to next', async ()=> {
        il = function () {
            return Promise.reject('error')
        }
        await infinity(il)
            .catch((err) => {
                assert(err==='error')
            })
    })

})
