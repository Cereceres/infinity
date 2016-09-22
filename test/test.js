'use strict'
const infinity = require('../index')
require('co-mocha')
const assert = require('assert')

describe('test to infinity loop', function () {
    before(function () {
        let counter = 0
        this.il = function (next,stop) {
            if (counter>10) {
                stop(null,counter)
            }
            counter++
            next()
        }
    })
    it('should return a promise', function* () {
        let res = yield infinity(this.il)
        assert(res>10)
    })

    it('should wait until the promise returned be resolved', function* () {
        let counter = 0
        this.il = function (next,stop,arg) {
            assert(arg==='test')
            if (counter>10) {
                stop(null,counter)
            }
            counter++
            next(Promise.resolve('test'))
        }
        let res = yield infinity(this.il,'test')
        assert(res>10)
    })
    it('should follow the flow when next is not called', function* () {
        let counter = 0
        this.il = function (next,stop,arg) {
            assert(arg==='test')
            if (counter>10) {
                stop(null,counter)
            }
            counter++
            return Promise.resolve('test')
        }
        let res = yield infinity(this.il,'test')
        assert(res>10)
    })

    it('should catch the error passed to stop', function* () {
        this.il = function (next,stop) {
            stop('error')
        }
        yield infinity(this.il)
        .catch((err) => {
            assert(err==='error')
        })
    })

    it('should catch the error thrown', function* () {
        this.il = function () {
            throw new Error('error thrown')
        }
        yield infinity(this.il)
            .catch((err) => {
                assert(err.message==='error thrown')
            })
    })

    it('should return a promise rejected if a promise rejected is passed to next', function* () {
        this.il = function () {
            return Promise.reject('error')
        }
        yield infinity(this.il)
            .catch((err) => {
                assert(err==='error')
            })
    })

})
