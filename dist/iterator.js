(function() {
  var Iterator;

  Iterator = (function() {
    function Iterator(list, startId, endId) {
      if (endId == null) {
        endId = 0;
      }
      this.list = list;
      this.currentId = this.startId = startId;
      this.endId = endId;
    }

    Iterator.prototype.current = function() {
      return this.list.get(this.currentId);
    };

    Iterator.prototype.reset = function() {
      this.currentId = this.startId;
      return this;
    };

    Iterator.prototype.moveNext = function() {
      this.currentId = this.list.next(this.currentId);
      return !!this.currentId && this.currentId !== this.endId;
    };

    Iterator.prototype.movePrevious = function() {
      this.currentId = this.list.prev(this.currentId);
      return !!this.currentId && this.currentId !== this.endId;
    };

    Iterator.prototype.next = function() {
      if (this.moveNext()) {
        return {
          value: this.current(),
          done: false,
          id: this.currentId
        };
      } else {
        return {
          done: true,
          id: this.currentId
        };
      }
    };

    Iterator.prototype.previous = function() {
      if (this.movePrevious()) {
        return {
          value: this.current(),
          done: false,
          id: this.currentId
        };
      } else {
        return {
          done: true,
          id: this.currentId
        };
      }
    };

    return Iterator;

  })();

  module.exports = Iterator;

}).call(this);

//# sourceMappingURL=iterator.js.map
