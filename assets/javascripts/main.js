(function() {
  var ListView, observe,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  observe = function(source, callback) {
    var idBySourceId, list, sourceIdById;
    list = Sonic([]);
    sourceIdById = {};
    idBySourceId = {};
    source.forEach(function(value, sourceId) {
      var id;
      id = list.push(value);
      sourceIdById[id] = sourceId;
      idBySourceId[sourceId] = id;
      return true;
    });
    source.onInvalidate(function(sourcePrev, sourceNext) {
      var currentId, events, id, iterator, sourceId, sourceIterator;
      events = [];
      sourceIterator = source.getIterator(sourcePrev, sourceNext);
      iterator = list.getIterator(idBySourceId[sourcePrev], idBySourceId[sourceNext]);
      while (true) {
        while (iterator.moveNext()) {
          if (source.has(sourceId = sourceIdById[iterator.currentId])) {
            break;
          }
          list["delete"](iterator.currentId);
          events.push({
            type: "delete",
            obj: source,
            key: sourceIdById[iterator.currentId],
            oldValue: iterator.current()
          });
          delete sourceIdById[iterator.currentId];
          delete idBySourceId[sourceId];
        }
        while (sourceIterator.moveNext()) {
          if (list.has(currentId = idBySourceId[sourceIterator.currentId])) {
            break;
          }
          id = list.add(sourceIterator.current(), null, iterator.currentId || 0);
          sourceIdById[id] = sourceIterator.currentId;
          idBySourceId[sourceIterator.currentId] = id;
          events.push({
            type: "add",
            obj: source,
            key: sourceIdById[id]
          });
        }
        if ((idBySourceId[sourceId] === currentId) && (sourceIdById[currentId] === sourceId) && (iterator.current() !== sourceIterator.current())) {
          events.push({
            type: "update",
            obj: source,
            key: sourceIdById[iterator.currentId],
            oldValue: iterator.current()
          });
          list.set(iterator.currentId, sourceIterator.current());
        }
        if (!sourceIterator.currentId) {
          break;
        }
      }
      return callback(events);
    });
  };

  rivets.binders['sonic-each-*'] = {
    "function": true,
    bind: function(el) {
      var attr, view, _i, _len, _ref;
      console.log('bind');
      this.exports = new Map();
      if (this.marker == null) {
        attr = [this.view.prefix, this.type].join('-').replace('--', '-');
        this.marker = document.createComment(" rivets: " + this.type + " ");
        this.iterated = [];
        el.removeAttribute(attr);
        el.parentNode.insertBefore(this.marker, el);
        el.parentNode.removeChild(el);
      } else {
        _ref = this.iterated;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          view = _ref[_i];
          view.bind();
        }
      }
    },
    unbind: function(el) {
      var key, keys, _i, _len, _results;
      console.log('unbind');
      keys = Object.keys(this.views);
      _results = [];
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        _results.push(this.binder["delete"].call(this, key));
      }
      return _results;
    },
    routine: function(el, list) {
      var modelName;
      console.log('routine', list);
      modelName = this.args[0];
      this.el = el;
      this.list = list;
      if (this.views && this.views[key]) {
        this.binder["delete"].call(this, key);
      }
      this.views = {};
      this.list.forEach((function(_this) {
        return function(value, id) {
          console.log("Adding", id, value);
          _this.binder.add.call(_this, id, value);
          return true;
        };
      })(this));
      return observe(this.list, (function(_this) {
        return function(events) {
          var event, eventKey, eventModel, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = events.length; _i < _len; _i++) {
            event = events[_i];
            eventKey = event.key;
            eventModel = event.obj.get(event.key);
            console.log("List update", eventKey, eventModel);
            switch (event.type) {
              case 'add':
                _results.push(_this.binder.add.call(_this, eventKey, eventModel));
                break;
              case 'delete':
                _results.push(_this.binder["delete"].call(_this, eventKey, eventModel));
                break;
              case 'update':
                _results.push(_this.views[eventKey].bindings[0].set(eventModel));
                break;
              default:
                _results.push(void 0);
            }
          }
          return _results;
        };
      })(this));
    },
    add: function(key, model) {
      var data, modelName, options, template, view;
      modelName = this.args[0];
      data = {
        index: key
      };
      data[modelName] = model;
      this.exports.set(key, data);
      options = this.view.options();
      options.preloadData = true;
      template = this.el.cloneNode(true);
      view = new rivets._.View(template, data, options);
      this.views[key] = view;
      view.bind();
      return this.marker.parentNode.insertBefore(template, typeof previous !== "undefined" && previous !== null ? previous.nextSibling : void 0);
    },
    "delete": function(key, model) {
      var view;
      view = this.views[key];
      view.unbind();
      view.els.forEach(function(el) {
        return el.remove();
      });
      return delete this.views[key];
    }
  };

  ListView = (function(_super) {
    __extends(ListView, _super);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.setComponent({
      html: {
        "div.shadow-abstract-view .shadow-expandable-view .shadow-enumerable-view .sonic-list-view": {
          "table": [
            {
              "thead[rv-on-click='toggle']": {
                "tr": {
                  "td[colspan='2']": "{ name }"
                }
              }
            }, {
              "tbody[rv-if='expanded']": {
                "tr[rv-sonic-each-entry='item']": [
                  {
                    "td.key[rv-text='index']": ""
                  }, {
                    "td.value[rv-view='entry']": ""
                  }
                ]
              }
            }
          ]
        }
      },
      css: {
        ".shadow-abstract-view": {}
      }
    });

    return ListView;

  })(Shadow.EnumerableView);

  Shadow.factories.unshift(function(list) {
    if (!(list instanceof Sonic.AbstractList)) {
      return null;
    }
    return new ListView(list);
  });

}).call(this);
