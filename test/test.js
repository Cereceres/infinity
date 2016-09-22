'use strict';
const infinity = require('../index')
require('co-mocha')
const assert = require('assert')

describe('test to infinity loop', function () {
    before(function () {
        let counter = 0;
        this.il = function (stop) {
            if (counter>10) {
                stop()
            }
            counter++
            return counter
        };
    });
it('should return a promise', function* () {
let res = yield infinity(this.il);
assert(res>10)
});
})
