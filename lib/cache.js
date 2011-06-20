var Cache;
var __hasProp = Object.prototype.hasOwnProperty;
module.exports = Cache = function(options) {
  var k, v;
  for (k in options) {
    if (!__hasProp.call(options, k)) continue;
    v = options[k];
    this[k] = v;
  }
  return this;
};
Cache.NOT_EXISTING = new Error;