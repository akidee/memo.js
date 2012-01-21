var Cache, NOT_EXISTING, SimpleCache, hasOwnProperty, util;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty;
util = require('util');
Cache = require('../cache');
NOT_EXISTING = Cache.NOT_EXISTING;
hasOwnProperty = Object.prototype.hasOwnProperty;
module.exports = SimpleCache = function(options) {
  Cache.call(this, options);
  this.data = this.data || {};
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
  if (hasOwnProperty.call(this.data, key)) {
    data = this.data[key];
    data[1]++;
    return __(null, data[0]);
  }
  return __(null, NOT_EXISTING);
};
SimpleCache.prototype.set = function(key, data, __) {
  this.data[key] = [data, 1];
  if (this.maxAge) {
    this.timeslot().push(key);
  }
  return __(null);
};
SimpleCache.prototype.del = function(key) {
  return delete this.data[key];
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
  var accesses, k, le, reducedLength, t, v, _ref, _ref2;
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
  _ref = this.data;
  for (k in _ref) {
    v = _ref[k];
    accesses.push(v[1]);
  }
  le = accesses.sort(function(a, b) {
    return b - a;
  })[reducedLength];
  _ref2 = this.data;
  for (k in _ref2) {
    if (!__hasProp.call(_ref2, k)) continue;
    v = _ref2[k];
    if (v[1] <= le) {
      this.del(k);
    }
  }
  if (this.debug) {
    console.log("node_memo simple cache: Reduced to " + reducedLength + " in " + (Date.now() - t) + " ms");
  }
  return true;
};
SimpleCache.prototype.length = function() {
  return Object.keys(this.data).length;
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