var Cache, a, data;
Cache = require('../cache');
a = require('assert');
a.strictEqual(Cache.NOT_EXISTING instanceof Error, true);
data = {
  a: 1,
  b: 2,
  c: 3
};
a.deepEqual(new Cache(data), data);
console.log('Passed');