
const infinity = module.exports = (il, ...arg) => {
    if (typeof il !== 'function') return Promise.reject(new Error('iterator is not a function'));
    return new Promise((resolve, reject) => {
        let stopped = false;
        let res;
        const stop = function(error, res) {
            if(stopped) return;
            stopped = true;
            if(error) return reject(error);
            resolve(res);
        };

        const next = function(pass) {
            next.called = true;
            if(stopped) return;
            if(!stopped && pass && typeof pass.then === 'function') {
                res = pass.then((_res) => next(_res)).catch((err) => setImmediate(stop, err));
                return;
            }
            if(!stopped) setImmediate(tried, pass);
        };
        next.called = false;

        const tried = function(pass) {
            try {
                next.called = false;
                res = il(next, stop, pass);
                if(!next.called && !infinity.async) setImmediate(next, res);
            } catch (err) {
                reject(err);
            }
        };
        const _arguments = res ? [ res ] : arg;
        setImmediate(tried, ..._arguments);
    });
};
infinity.async = true;
