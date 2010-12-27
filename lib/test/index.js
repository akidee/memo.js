var TIME_TOLERANCE, WAIT, a, asyncData, context, data, fs, memo, stat, step, t;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
memo = require('../../');
a = require('assert');
step = require('step');
fs = require('fs');
TIME_TOLERANCE = 25;
WAIT = 500;
data = {
  0: [new Error],
  1: [void 0, []],
  2: [void 0, 'Stefan', 'Juli'],
  3: [new Error]
};
context = {
  a: 1,
  b: 0
};
asyncData = memo(function(key, _cb) {
  return setTimeout(__bind(function() {
    var values;
    values = data[key];
    if (values[0] instanceof Error) {
      values[0].b = this.b++;
    }
    if (values[1] instanceof Array) {
      values[1].push(this.a);
    }
    return _cb.apply(null, values);
  }, this), WAIT);
}, {
  context: context,
  hashFunc: function(key) {
    return '' + key;
  },
  data: {
    4: [void 0, 'OK']
  }
});
stat = memo(fs.stat, {
  context: fs
});
t = +new Date;
step(function() {
  " Correctness ";  asyncData(1, function(e, value) {
    a.strictEqual(e, void 0);
    return a.strictEqual(value.length, 1);
  });
  return setTimeout(this, 5);
}, function() {
  " Unique call, time (evented callback) ";  return asyncData(1, __bind(function(e, value) {
    var _ref;
    a.strictEqual((t + WAIT - TIME_TOLERANCE < (_ref = +new Date) && _ref < t + WAIT + TIME_TOLERANCE), true);
    a.strictEqual(e, void 0);
    a.strictEqual(value.length, 1);
    return this();
  }, this));
}, function() {
  " Correctness and time (without evented callback) ";  return asyncData(1, __bind(function(e, value) {
    a.strictEqual(e, void 0);
    a.strictEqual(value.length, 1);
    return this();
  }, this));
}, function() {
  " Correctness ";  return asyncData(2, __bind(function(e, value1, value2) {
    a.strictEqual(e, void 0);
    a.strictEqual(value1, 'Stefan');
    a.strictEqual(value2, 'Juli');
    return this();
  }, this));
}, function() {
  " Correctness ";  return asyncData(3, __bind(function(e, value) {
    a.strictEqual(e instanceof Error, true);
    a.strictEqual(value, void 0);
    return this();
  }, this));
}, function() {
  " Correctness ";  return asyncData(4, __bind(function(e, value) {
    a.strictEqual(e, void 0);
    a.strictEqual(value, 'OK');
    return this();
  }, this));
}, function() {
  return stat(__filename, __bind(function(e, stats) {
    a.strictEqual(e != null, false);
    a.strictEqual(typeof (stats != null ? stats.size : void 0), 'number');
    console.log('Passed');
    return process.exit();
  }, this));
});