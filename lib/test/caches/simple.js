var Cache, SimpleCache, a, cache, data, le, step;
Cache = require('../../cache');
SimpleCache = require('../../caches/simple');
a = require('assert');
step = require('step');
le = function(e) {
  if ((e != null ? e.name : void 0) === 'AssertionError') {
    console.log(e);
    console.log(e.stack);
    return process.exit();
  }
};
data = {
  a: 1
};
a.deepEqual(new SimpleCache(data), {
  a: 1,
  data: {},
  maxLength: 0,
  maxAge: 0,
  intervals: []
});
data = {
  data: {
    a: [5, 1]
  },
  maxAge: 2,
  maxLength: 4
};
cache = new SimpleCache(data);
a.strictEqual(cache.data, data.data);
a.strictEqual(cache.maxAge, data.maxAge);
a.strictEqual(cache.maxLength, data.maxLength);
step.async(function() {
  return cache.get('a', this);
}, function(e, r) {
  le(e);
  a.strictEqual(e != null, false);
  a.strictEqual(r, 5);
  a.strictEqual(cache.data.a[1], 2);
  return cache.get('b', this);
}, function(e, r) {
  le(e);
  a.strictEqual(e != null, false);
  a.strictEqual(r, Cache.NOT_EXISTING);
  return cache.set('b', {
    a: 5
  }, this);
}, function(e) {
  a.strictEqual(e != null, false);
  a.deepEqual(cache.data.b, [
    {
      a: 5
    }, 1
  ]);
  cache.del('a');
  a.deepEqual('a' in cache.data, false);
  return setTimeout(this, 2000);
}, function() {
  a.strictEqual('b' in cache.data, false);
  cache.set('a', 1, function() {});
  cache.set('b', 1, function() {});
  cache.set('c', 1, function() {});
  cache.set('d', 1, function() {});
  cache.get('c', function() {});
  cache.get('d', function() {});
  return setTimeout(this, 1000);
}, function(e) {
  a.strictEqual('a' in cache.data, false);
  a.strictEqual('b' in cache.data, false);
  a.strictEqual('c' in cache.data, true);
  a.strictEqual('d' in cache.data, true);
  return this();
}, function(e) {
  le(e);
  console.log('Passed');
  return process.exit();
});