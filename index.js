const message = 'Infinity iterator is not a function';
const promiseRejected = Promise.reject(new Error(message));
const stopped = Symbol('stopped');
const called = Symbol('called');
const infinity = module.exports = (il, ...arg) => {
    if (typeof il !== 'function') return promiseRejected;
    return new Promise((resolve, reject) => {
        const stop = function(error, res) {
            if (next[called] || stop[stopped]) return;
            stop[stopped] = true;
            if (error) return reject(error);
            resolve(res);
        };

        const next = function(pass, ...others) {
            if(stop[stopped] || next[called]) return;

            next[called] = true;
            if(pass instanceof Promise) return pass
                .then((_res) => process.nextTick(tried, _res))
                .catch((err) => {
                    next[called] = false;
                    process.nextTick(stop, err);
                });

            process.nextTick(tried, pass, ...others);
        };

        const tried = function(...pass) {
            try {
                next[called] = false;
                stop[stopped] = false;
                const returned = il(next, stop, ...pass);
                if(stop[stopped] || next[called]) return;
                process.nextTick(next, returned);
            } catch (err) {
                reject(err);
            }
        };
        process.nextTick(tried, ...arg);
    });
};
infinity.async = true;
