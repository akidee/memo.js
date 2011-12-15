var step;
step = require('stepc');
step.async(function() {
  var group;
  group = this.group();
  require('./index')(group());
  require('./cache');
  return require('./caches/simple')(group());
}, function(e) {
  if (e) {
    console.log(e);
    console.log(e.stack);
  }
  return process.exit();
});