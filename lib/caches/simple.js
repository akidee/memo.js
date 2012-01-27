var Cache, Hash, NOT_EXISTING, SimpleCache, hasOwnProperty, util;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
util = require('util');
Hash = require('hash');
Cache = require('../cache');
NOT_EXISTING = Cache.NOT_EXISTING;
hasOwnProperty = Object.prototype.hasOwnProperty;
module.exports = SimpleCache = function(options) {
  Cache.call(this, options);
  this.data = new Hash(this.data);
  this.maxLength = this.maxLength || 0;
  this.maxAge = this.maxAge || 0;
  this.debug = this.debug || false;
  this.intervals = [];
  if (this.maxLength) {
    setTimeout(__bind(function() {
      return this.intervals.push(setInterval(__bind(function() {
        return this.reduce();
      }, this), 500));
    }, this), 100);
  }
  if (this.maxAge) {
    this.millis = (new Date).getMilliseconds();
    this.timeslots = {};
    this.intervals.push(setInterval(__bind(function() {
      var secs, _results;
      secs = this.seconds(this.maxAge);
      _results = [];
      while (this.removeTimeslot(secs)) {
        _results.push(secs--);
      }
      return _results;
    }, this), 1000));
  }
  return this;
};
util.inherits(SimpleCache, Cache);
SimpleCache.prototype.seconds = function(minus) {
  if (minus == null) {
    minus = 0;
  }
  return Math.floor((Date.now() - this.millis) / 1000) - minus;
};
SimpleCache.prototype.timeslot = function(minus) {
  var secs;
  if (minus == null) {
    minus = 0;
  }
  secs = this.seconds();
  if (this.timeslots[secs]) {
    return this.timeslots[secs];
  } else {
    return this.timeslots[secs] = [];
  }
};
SimpleCache.prototype.get = function(key, __) {
  var data;
  data = this.data.get(key);
  if (data) {
    data[1]++;
    return __(null, data[0]);
  }
  return __(null, NOT_EXISTING);
};
SimpleCache.prototype.set = function(key, data, __) {
  this.data.set(key, [data, 1]);
  if (this.maxAge) {
    this.timeslot().push(key);
  }
  return __(null);
};
SimpleCache.prototype.del = function(key) {
  return this.data.del(key);
};
SimpleCache.prototype.destruct = function() {
  var i, _i, _len, _ref, _results;
  _ref = this.intervals;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    i = _ref[_i];
    _results.push(clearInterval(i));
  }
  return _results;
};
SimpleCache.prototype.reduce = function() {
  var accesses, le, reducedLength, t, _this;
  if (this.debug) {
    console.log("node_memo simple cache: Current length: " + (this.length()));
  }
  if (this.length() < this.maxLength) {
    return false;
  }
  if (this.debug) {
    t = Date.now();
  }
  reducedLength = Math.floor(this.maxLength / 2);
  accesses = [];
  this.data.forEach(function(v, k) {
    return accesses.push(v[1]);
  });
  le = accesses.sort(function(a, b) {
    return b - a;
  })[reducedLength];
  _this = this;
  this.data.forEach(function(v, k) {
    if (v[1] <= le) {
      return _this.del(k);
    }
  });
  if (this.debug) {
    console.log("node_memo simple cache: Reduced to " + reducedLength + " in " + (Date.now() - t) + " ms");
  }
  return true;
};
SimpleCache.prototype.length = function() {
  return Object.keys(this.data.getData()).length;
};
SimpleCache.prototype.removeTimeslot = function(slot) {
  var key, list, num, t, _i, _len;
  list = this.timeslots[slot];
  if (!(list != null)) {
    return false;
  }
  if (this.debug) {
    t = Date.now();
  }
  num = list.length;
  for (_i = 0, _len = list.length; _i < _len; _i++) {
    key = list[_i];
    this.del(key);
  }
  delete this.timeslots[slot];
  if (this.debug) {
    console.log("node_memo simple cache: Removed " + num + " objects in timeslot " + slot + " in " + (Date.now() - t) + " ms");
  }
  return true;
};