# Infinity
Control flow to use a function whats is called infinity times.
nodejs > 6 is required.

## Install

```bash
$ npm install infinity-node --save
```

## Usage

```js
// callback examples
const infinity = require('infinity-node')
const assert = require('assert')
let counter = 0;

let il = function (next,stop, arg) {
    assert(arg ==='arg')
    if (counter>10) {stop(null,counter)
    counter++
    next('arg')
}
infinity(il).then((res) => {
    assert(res>10)
})

// example 2

async ()=> {
    let counter = 0
    il = function ( next,stop, arg) {
        assert(arg==='test')
        if (counter>10) stop(null,counter)
        counter++
        next(Promise.resolve('test'))
    }
    let res = await infinity(il,'test')
    assert(res>10)
}

// example 3, the stop is not called if next is called before
async ()=> {
    let counter = 0
    il = function (next,stop, arg) {
        assert(arg==='test')
        if (counter>10) stop(null,counter)
        counter++
        next(Promise.resolve('test'))
        stop(new Error('error'))
    }
    let res = await infinity(il,'test')
    assert(res>10)
// example 4, the next is not called if stop is called before
async ()=> {
    let counter = 0
    il = function (next,stop, arg) {
        assert(arg==='test')
        if (counter>10) stop(null,counter)
        counter++
        stop(null, 'resolve')
        next()
    }
    let res = await infinity(il,'test')
    assert(res ==='resolve')
}
// example 5, pass all arguments
async ()=> {
    let counter = 0
    il = function (next,stop,arg1, arg2) {
        assert(arg1==='arg1')
        assert(arg2==='arg2')
        if (counter>10) stop(null,counter)
        counter++
        next('arg1','arg2')
    }
    let res = await infinity(il,'arg1','arg2')
    assert(res === 11)
}
// example 6 if return a promise, wait until promise is resolved or rejected
async () =>{
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
}
// example 6.1
async ()=> {
        il = function () {
            return Promise.reject('error')
        }
        await infinity(il)
            .catch((err) => {
                assert(err==='error')
            })
    }
// catch any error throw
async () =>{
    il = function () {
        throw new Error('error thrown')
    }
    await infinity(il)
        .catch((err) => {
            assert(err.message==='error thrown')
        })
}
}
```

## infinity-node(callback[, arg1, arg2, ...])-> Promise
The first time callback function is called with three arguments arg, next and stop
given when the infinity function is called. This function return a promise.
### next([object])
The arg passed to this callback is passed like third param to callback in infinity.
If next is not called in callback and async property in infinity is false,
then next is called when callback is done with the returned valued.
When a promise is passed to next, the loop is called again until the promise is resolved.
### stop([error,value])
When is called the loop is stopped. If error is different to null then the promise returned
 by infinity is rejected. In otherwise the promise is resolved with value given.
