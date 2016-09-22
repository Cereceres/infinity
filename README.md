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
let il = function (stop) {
    if (counter>10) {
                stop()
    }
    counter++
    return counter
}
infinity(il).then((res) => {
    assert(res>10)
})
```

## infinity
