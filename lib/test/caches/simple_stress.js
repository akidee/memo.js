var DEBUG_CACHE, MAX_AGE, MAX_LENGTH, RUNNING, UNIQUE_CALLS, a, fun, interval, memo;
memo = require('../../');
a = require('assert');
MAX_LENGTH = 100000;
UNIQUE_CALLS = 500000;
RUNNING = 240000;
MAX_AGE = 0;
DEBUG_CACHE = true;
fun = memo(function(a) {
  return {
    a: a,
    b: 'This should be a long, long string',
    c: [1, 2, 3, 4, 5]
  };
}, {
  isSync: true,
  maxAge: MAX_AGE,
  maxLength: MAX_LENGTH,
  debug: DEBUG_CACHE,
  hashFunc: function(a) {
    return a;
  }
});
(interval = function() {
  return fun(Math.round(Math.random() * UNIQUE_CALLS), function(e, r) {
    a.strictEqual(e != null, false);
    return process.nextTick(interval);
  });
})();
setTimeout(function() {
  return process.exit();
}, RUNNING);
console.log('length / Memory (MB) ... ');
setInterval(function() {
  return console.log(fun.cache.length(), process.memoryUsage().rss / 1000000);
}, 2000);