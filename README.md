# Infinity
Control flow to use a function whats is called infinity times.

## Install

```bash
$ npm install infinity --save
```

## Usage

```js
const infinity = require('infinity')
require('co-mocha')
const assert = require('assert')
let counter = 0;
let il = function (next,stop) {
    if (counter>10) {
        stop(null,counter)
    }
    counter++
    next()
}
infinity(il).then((res) => {
    assert(res>10)
})
```

## infinity(callback[, arg])-> Promise
The first time callback function is called with three arguments next, stop and arg
given when the infinity function is called. This function return a promise.
### next([object])
The arg passed to this callback is passed like third param to callback in infinity.
If next is not called in callback, then is called when callback is done with the returned valued.
When a promise is passed to next, the loop is called again until the promise is resolved.
### stop([error,value])
When is called the loop is stopped. If error is different to null then the promise returned
 by infinity is rejected. In otherwise the promise is resolved with value given.
