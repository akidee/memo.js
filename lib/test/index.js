var a, async, context, fs, le, memo, result, step, sync;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
memo = require('../');
a = require('assert');
step = require('step');
fs = require('fs');
le = function(e) {
  if ((e != null ? e.name : void 0) === 'AssertionError') {
    console.log(e);
    console.log(e.stack);
    return process.exit();
  }
};
context = {
  i: 5
};
sync = null;
async = null;
result = null;
step.async(function() {
  sync = memo(function(i) {
    if (!i) {
      throw new Error('Must not divide by 0');
    }
    return this.i / i;
  }, {
    context: context,
    hashFunc: function(i) {
      return '' + i;
    },
    cache: './caches/simple',
    isSync: true
  });
  a.strictEqual(typeof sync, 'function');
  return sync(0, this);
}, function(e, r) {
  le(e);
  result = arguments;
  a.strictEqual(e instanceof Error, true);
  a.strictEqual(r != null, false);
  return sync(0, this);
}, function(e, r) {
  le(e);
  a.strictEqual(arguments[0], result[0]);
  return sync(2, this);
}, function(e, r) {
  var f, g, i, ready;
  le(e);
  a.strictEqual(e != null, false);
  a.strictEqual(r, context.i / 2);
  async = memo(function(i, __) {
    if (!i) {
      e = new Error('Must not divide by 0');
      r = null;
    } else {
      e = null;
      r = this.i / i;
    }
    return setTimeout(function() {
      return __(e, r);
    }, 1000);
  }, {
    context: context,
    hashFunc: function(i) {
      return '' + i;
    },
    cache: './caches/simple'
  });
  a.strictEqual(typeof async, 'function');
  i = 2;
  f = null;
  g = null;
  ready = __bind(function() {
    a.strictEqual(f, g);
    return this();
  }, this);
  async(0, __bind(function(e, r) {
    a.strictEqual(e instanceof Error, true);
    f = e;
    if (--i === 0) {
      return ready();
    }
  }, this));
  return async(0, __bind(function(e, r) {
    a.strictEqual(e instanceof Error, true);
    g = e;
    if (--i === 0) {
      return ready();
    }
  }, this));
}, function(e) {
  le(e);
  return async(5, this);
}, function(e, r) {
  le(e);
  a.strictEqual(e instanceof Error, false);
  a.strictEqual(r, 1);
  return this();
}, function(e) {
  le(e);
  console.log('Passed');
  return process.exit(0);
});