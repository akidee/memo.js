var COMPUTING, EventEmitter, exports, slice, _defaultHashFunc;
var __slice = Array.prototype.slice;
EventEmitter = require('events').EventEmitter;
slice = Array.prototype.slice;
COMPUTING = {};
_defaultHashFunc = function() {
  return JSON.stringify(arguments);
};
exports = module.exports = function(func, options) {
  var context, data, ee, hashFunc, memoized;
  if (options == null) {
    options = {};
  }
  context = options.context || null;
  hashFunc = options.hashFunc || _defaultHashFunc;
  data = options.data || {};
  ee = new EventEmitter;
  memoized = function() {
    var args, hash, value, __, __cb, _i;
    args = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), __ = arguments[_i++];
    hash = hashFunc.apply(context, args);
    value = data[hash];
    if (hash in data) {
      if (value !== COMPUTING) {
        __.apply(null, value);
        return true;
      } else {
        ee.on(hash, __);
        return false;
      }
    } else {
      data[hash] = COMPUTING;
      ee.on(hash, __);
      __cb = function() {
        data[hash] = arguments;
        ee.emit.apply(ee, [hash].concat(slice.call(arguments)));
        return ee.removeAllListeners(hash);
      };
      func.apply(context, args.concat([__cb]));
      return false;
    }
  };
  memoized.data = data;
  return memoized;
};
exports.hashFunc = _defaultHashFunc;