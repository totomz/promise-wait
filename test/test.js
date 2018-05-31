const waitUntill = require('../index');
const rp = require('request-promise');
const expect = require('chai').expect;

let counter = -1;

describe('Wait untill promise resolve', function() {

    it('Wait for a condition', function() {
        counter = -1;
        this.timeout(10 * 60 * 1000);

        return waitUntill(
            // Function that gets executed
            () => new Promise((resolve, reject) => { resolve(++counter); }).then(c => rp(`https://httpbin.org/get?run=${c}`)).then(JSON.parse),

            // while(condition)
            (action) => (action.args.run === '4')
        )
        .then(res => {
            expect(res.args.run).to.be.equal('4');
        });

    });

    it('Default fail after 10 attempts', function() {
        counter = -1;
        this.timeout(10 * 60 * 1000);

        return waitUntill(
            // Function that gets executed
            () => new Promise((resolve, reject) => { resolve(++counter); }).then(c => rp(`https://httpbin.org/get?run=${c}`)).then(JSON.parse),

            // while(condition)
            (action) => (action.args.run === '12')
        )
        .then(res => {
            throw new Error('Expecting a failure');
        })
        .catch(err => {
            // It is failing due to max attempts.
            // The response has the last function value (10 requests done)
            expect(err.args.run).to.be.equal('9');
        })


    });

})
