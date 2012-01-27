var Cache, EventEmitter, Hash, NOT_EXISTING, exports, functions, hasOwnProperty, slice, _defaultHashFunc;
var __slice = Array.prototype.slice;
Cache = require('./cache');
EventEmitter = require('events').EventEmitter;
Hash = require('hash');
NOT_EXISTING = Cache.NOT_EXISTING;
slice = Array.prototype.slice;
hasOwnProperty = Object.prototype.hasOwnProperty;
_defaultHashFunc = function() {
  return JSON.stringify(arguments);
};
exports = module.exports = function(func, options) {
  var cache, cacheModuleId, computing, context, ee, hashFunc, isSync, memoized;
  if (options == null) {
    options = {};
  }
  context = options.context || null;
  hashFunc = options.hashFunc || _defaultHashFunc;
  cacheModuleId = options.cache || './caches/simple';
  isSync = options.isSync || false;
  delete options.context;
  delete options.hashFunc;
  delete options.cache;
  delete options.isSync;
  ee = new EventEmitter;
  computing = new Hash;
  cache = new (require(cacheModuleId))(options);
  memoized = function() {
    var args, hash, __, _i;
    args = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), __ = arguments[_i++];
    hash = hashFunc.apply(context, args);
    if (computing.has(hash)) {
      return ee.once(hash, __);
    } else {
      return cache.get(hash, function(e, data) {
        var callback, result;
        if (e) {
          return __(e);
        }
        if (data !== NOT_EXISTING) {
          return __.apply(null, data);
        } else {
          computing.set(hash, true);
          ee.once(hash, __);
          callback = function() {
            var _args;
            _args = arguments;
            return cache.set(hash, _args, function(e) {
              _args = !e ? [hash].concat(slice.call(_args)) : [hash].concat(e);
              computing.del(hash);
              return ee.emit.apply(ee, _args);
            });
          };
          if (!isSync) {
            return func.apply(context, args.concat([callback]));
          } else {
            e = null;
            try {
              result = func.apply(context, args);
            } catch (f) {
              e = f;
            }
            return callback(e, result);
          }
        }
      });
    }
  };
  memoized.cache = cache;
  functions.push(memoized);
  return memoized;
};
exports.hashFunc = _defaultHashFunc;
functions = exports.functions = [];
exports.stop = function() {
  var fun, _base, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = functions.length; _i < _len; _i++) {
    fun = functions[_i];
    _results.push(typeof (_base = fun.cache).destruct === "function" ? _base.destruct() : void 0);
  }
  return _results;
};