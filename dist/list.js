(function() {
  var AbstractList, MutableList,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  AbstractList = require('./abstract_list');

  MutableList = (function(_super) {
    __extends(MutableList, _super);

    function MutableList(values) {
      var value, _i, _len;
      MutableList.__super__.constructor.call(this);
      this._next[0] = 0;
      this._prev[0] = 0;
      if (values != null) {
        for (_i = 0, _len = values.length; _i < _len; _i++) {
          value = values[_i];
          this._add(value, null, 0);
        }
      }
    }

    MutableList.prototype.set = function(id, value) {
      return this._set(id, value);
    };

    MutableList.prototype.push = function(value) {
      return this._add(value, null, 0);
    };

    MutableList.prototype.unshift = function(value) {
      return this._add(value, 0);
    };

    MutableList.prototype.pop = function() {
      var id, value;
      id = this.prev();
      value = this.get(id);
      if (this._delete(id)) {
        return value;
      }
    };

    MutableList.prototype.shift = function() {
      var id, value;
      id = this.next();
      value = this.get(id);
      if (this._delete(id)) {
        return value;
      }
    };

    MutableList.prototype.remove = function(value) {
      var id;
      id = this.idOf(value);
      return this._delete(id);
    };

    MutableList.prototype["delete"] = function(id) {
      return this._delete(id);
    };

    return MutableList;

  })(AbstractList);

  module.exports = MutableList;

}).call(this);

//# sourceMappingURL=list.js.map
