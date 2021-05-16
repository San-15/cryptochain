const cryptoHash = require('./crypto-hash');

describe('cryptoHash()',()=>{
    it('generates a SHA-256 hashed output', ()=>{
        expect(cryptoHash('kill'))
        .toEqual('a25a7933faede6e6ac34db7302e29bf22971531a1dfbcb45ec34cc76df363dc1');
    });

    it('produces same output for same inputs in any order',()=>{
        expect(cryptoHash('one','two','three')).
        toEqual(cryptoHash('three','two','one'));
    });

    it('produces a unique hash when the properties have changed on an input',()=>{
        const foo ={};
        const originalHash = cryptoHash(foo);
        foo['a']= 'a';

        expect(cryptoHash(foo)).not.toEqual(originalHash);
    });
});