var should = require("should");
var fs = require("fs");
var assert = require('assert');

describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal(-1, [1, 2, 3].indexOf(4));
        });
    });
});


describe('同步测试', function() {
    it('数组测试', function() {
        assert.equal(-1, [1, 2, 3].indexOf(5));
        assert.equal(-1, [1, 2, 3].indexOf(0));
    })

    it('字符串合法性测试', function() {
        assert.equal("123", "123");
    })
})


describe('异步测试', function() {
    it('异步读取文件', function(done) {
        // index.js请自行添加，测试用例会读取里面的内容并比较
        fs.readFile("index.js", "utf8", function(err, data) {
            data.should.eql("test");
            done();
        })
    })
})


var user = {
    name: 'tj'
  , pets: ['tobi', 'loki', 'jane', 'bandit']
};

user.should.have.property('name', 'tj');
user.should.have.property('pets').with.lengthOf(4);

// If the object was created with Object.create(null)
// then it doesn't inherit `Object.prototype`, so it will not have `.should` getter
// so you can do:
should(user).have.property('name', 'tj');

// also you can test in that way for null's
should(null).not.be.ok();

// someAsyncTask(foo, function(err, result){
//   should.not.exist(err);
//   should.exist(result);
//   result.bar.should.equal(foo);
// });