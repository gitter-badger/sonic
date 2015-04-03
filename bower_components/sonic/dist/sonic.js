(function() {
  var Sonic, key, value, _fn, _ref,
    __slice = [].slice;

  Sonic = function() {
    return Sonic.factory.apply(Sonic, arguments);
  };

  Sonic.unit = function(item) {
    return new Sonic.Unit(item);
  };

  Sonic.empty = function() {
    return new Sonic.Unit();
  };

  Sonic.utilities = require('./utilities');

  Sonic.uniqueId = require('./unique_id');

  Sonic.factory = require('./factory');

  Sonic.Iterator = require('./iterator');

  Sonic.AbstractList = require('./abstract_list');

  Sonic.List = require('./list');

  Sonic.Unit = require('./unit');

  Sonic.FlatMapList = require('./flat_map_list');

  Sonic.GroupList = require('./group_list');

  Sonic.RangeList = require('./range_list');

  _ref = Sonic.utilities;
  _fn = (function(_this) {
    return function(key, value) {
      if (value instanceof Function) {
        return Sonic[key] = function() {
          var args, list;
          list = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          return value.apply(Sonic.factory(list), args);
        };
      } else {
        return Sonic[key] = value;
      }
    };
  })(this);
  for (key in _ref) {
    value = _ref[key];
    _fn(key, value);
  }

  module.exports = Sonic;

}).call(this);

//# sourceMappingURL=sonic.js.map