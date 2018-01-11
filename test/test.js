const infinity = require('../index')
const assert = require('assert')
let il = null
describe('test to infinity loop', function () {
    before(function () {
        let counter = 0
        il = function (...arg) {
            const stop = arg[arg.length-1]
            const next = arg[arg.length-2]
            const beff = arg.slice(2,arg.length-2)
            if (counter > 10) stop(null,counter)
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
        il = function (arg, next,stop) {
            assert(arg==='test')
            if (counter>10) stop(null,counter)
            counter++
            next(Promise.resolve('test'))
        }
        let res = await infinity(il,'test')
        assert(res>10)
    })

    it('should stop flow if next is called before stop', async ()=> {
        let counter = 0
        il = function (arg, next,stop) {
            assert(arg==='test')
            if (counter>10) stop(null,counter)
            counter++
            next(Promise.resolve('test'))
            stop(new Error('error'))
        }
        let res = await infinity(il,'test')
        assert(res>10)
    })
    it('should stop flow if stop is called before next', async ()=> {
        let counter = 0
        il = function (arg, next,stop) {
            assert(arg==='test')
            if (counter>10) stop(null,counter)
            counter++
            stop(null, 'resolve')
            next()
        }
        let res = await infinity(il,'test')
        assert(res ==='resolve')
    })

    it('should catch all arguments passed in infinity', async ()=> {
        let counter = 0
        il = function (arg1, arg2, next,stop) {
            assert(arg1==='arg1')
            assert(arg2==='arg2')
            if (counter>10) stop(null,counter)
            counter++
            stop(null, 'resolve')
            next()
        }
        let res = await infinity(il,'arg1','arg2')
        assert(res ==='resolve')
    })

    it('should catch all arguments passed in next', async ()=> {
        let counter = 0
        il = function (arg1, arg2, next,stop) {
            assert(arg1==='arg1')
            assert(arg2==='arg2')
            if (counter>10) stop(null,counter)
            counter++
            next('arg1','arg2')
        }
        let res = await infinity(il,'arg1','arg2')
        assert(res === 11)
    })
    it('should follow the flow when next is not called and async mode is false', async () =>{
        let counter = 0
        il = function (arg,next,stop) {
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

    it('should call next if is not called', async () =>{
        let counter = 0
        il = function (arg, next, stop) {
            assert(arg==='test')
            if (counter>10) stop(null,counter)
            counter++
            return 'test'
        }
        await infinity(il,'test')
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
