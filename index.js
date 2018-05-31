
const delay = (time) => (result) => new Promise(resolve => setTimeout(() => resolve(result), time));

/**
 * Execute func until condition returns TRUE, for opt.retries number of times
 * @param {function} func a funciton that returns a Promise
 * @param {function condition a function that take the result of func as parameter and returns a boolean
 * @param options {object}
 * @return {PromiseLike<T>}
 */
function waitUntill(func, condition, options){

    let opt = options || {};
    if(!opt.retries) {
        opt.retries = 10;
    }

    return func()
        .then(result => {
            return result;
        })
        .then(result => {
            if(condition(result)) {
                return result
            }
            else if (--opt.retries === 0) {
                return Promise.reject(result);
            }
            else {
                return Promise.resolve('')
                    .then(delay(2 * 1000))
                    .then(() => waitUntill(func, condition, opt) );
            }
        });
}

module.exports = waitUntill;