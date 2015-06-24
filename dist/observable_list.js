import { List } from './list';
import { Tree, Path } from './tree';
import { Subject } from './observable';
import ObservableCache from './observable_cache';
import ObservableIndex from './observable_index';
export class ListSubject extends Subject {
    constructor(...args) {
        super(...args);
        this.onInvalidate = (prev, next) => {
            this.notify(observer => { observer.onInvalidate(prev, next); });
        };
    }
}
;
export class ObservableList extends List {
    constructor(list) {
        super(list);
        this.observe = (observer) => {
            throw new Error("Not implemented");
        };
        this.reverse = () => {
            return ObservableList.create(ObservableList.reverse(this));
        };
        this.map = (mapFn) => {
            return ObservableList.create(ObservableList.map(this, mapFn));
        };
        this.filter = (filterFn) => {
            return ObservableList.create(ObservableList.filter(this, filterFn));
        };
        this.flatten = () => {
            return ObservableList.create(ObservableList.flatten(this));
        };
        this.flatMap = (flatMapFn) => {
            return ObservableList.create(ObservableList.flatMap(this, flatMapFn));
        };
        this.cache = () => {
            return ObservableList.create(ObservableList.cache(this));
        };
        this.index = () => {
            return ObservableList.create(ObservableList.index(this));
        };
        this.zip = (other, zipFn) => {
            return ObservableList.create(ObservableList.zip(this, other, zipFn));
        };
        this.skip = (k) => {
            return ObservableList.create(ObservableList.skip(this, k));
        };
        this.take = (n) => {
            return ObservableList.create(ObservableList.take(this, n));
        };
        this.range = (k, n) => {
            return ObservableList.create(ObservableList.range(this, k, n));
        };
        this.scan = (scanFn, memo) => {
            return ObservableList.create(ObservableList.scan(this, scanFn, memo));
        };
        if (list != null)
            this.observe = list.observe;
    }
    static isObservableList(obj) {
        return List.isList(obj) && !!obj['observe'];
    }
    static create(list) {
        return new ObservableList({
            get: list.get,
            prev: list.prev,
            next: list.next,
            observe: list.observe
        });
    }
    static reverse(list) {
        var { get, prev, next } = List.reverse(list);
        function observe(observer) {
            return list.observe({
                onInvalidate: function (prev, next) {
                    observer.onInvalidate(next, prev);
                }
            });
        }
        return { get, prev, next, observe };
    }
    static map(list, mapFn) {
        var { get, prev, next } = List.map(list, mapFn);
        return { get, prev, next, observe: list.observe };
    }
    static filter(list, filterFn) {
        var { get, prev, next } = List.filter(list, filterFn);
        var subject = new ListSubject();
        list.observe({
            onInvalidate: function (p, n) {
                prev(p).then(p => next(n).then(n => subject.onInvalidate(p, n)));
            }
        });
        return { get, prev, next, observe: subject.observe };
    }
    static flatten(list) {
        var flat = List.flatten(list), subject = new ListSubject(), subscriptions = Object.create(null);
        var cache = new ObservableCache({
            get: list.get,
            prev: list.prev,
            next: list.next,
            observe: (observer) => null
        });
        function createObserver(head) {
            var onInvalidate = (prev, next) => {
                Promise.all([
                    prev == null ? Tree.prev(list, [head]) : Path.append(head, prev),
                    next == null ? Tree.next(list, [head]) : Path.append(head, next)
                ]).then(([prev, next]) => {
                    subject.onInvalidate(Path.toKey(prev), Path.toKey(next));
                });
            };
            return { onInvalidate };
        }
        function prev(key) {
            return flat.prev(key).then(prev => {
                var path = Path.fromKey(prev), head = Path.head(path);
                if (head != null && !subscriptions[head]) {
                    list.get(head).then(list => subscriptions[head] = list.observe(createObserver(head)));
                }
                return prev;
            });
        }
        function next(key) {
            return flat.next(key).then(next => {
                var path = Path.fromKey(next), head = Path.head(path);
                if (head != null && !subscriptions[head]) {
                    list.get(head).then(list => subscriptions[head] = list.observe(createObserver(head)));
                }
                return next;
            });
        }
        list.observe({
            onInvalidate: (prev, next) => {
                // Unsubscribe from all lists in the range
                List.forEach(cache, (value, key) => {
                    if (!subscriptions[key])
                        return;
                    subscriptions[key].unsubscribe();
                    delete subscriptions[key];
                }, prev, next);
                // Find the prev and next paths, and invalidate
                Promise.all([
                    prev == null ? null : Tree.prev(list, [prev, null], 1),
                    next == null ? null : Tree.next(list, [next, null], 1)
                ]).then(([prev, next]) => {
                    subject.onInvalidate(Path.toKey(prev), Path.toKey(next));
                });
                // Invalidate cache
                cache.onInvalidate(prev, next);
            }
        });
        return { get: flat.get, prev, next, observe: subject.observe };
    }
    static flatMap(list, flatMapFn) {
        return ObservableList.flatten(ObservableList.map(list, flatMapFn));
    }
    static cache(list) {
        return new ObservableCache(list);
    }
    static index(list) {
        return new ObservableIndex(list);
    }
    static zip(list, other, zipFn) {
        list = ObservableList.index(list);
        other = ObservableList.index(other);
        function get(key) {
            return list.get(key).then(v => other.get(key).then(w => zipFn(v, w)));
        }
        function prev(key) {
            return list.prev(key).then(() => other.prev(key));
        }
        function next(key) {
            return list.next(key).then(() => other.next(key));
        }
        var subject = new ListSubject();
        list.observe(subject);
        other.observe(subject);
        return { get, prev, next, observe: subject.observe };
    }
    static skip(list, k) {
        return ObservableList.filter(ObservableList.index(list), function (value, key) {
            return key >= k;
        });
    }
    static take(list, n) {
        return ObservableList.filter(ObservableList.index(list), function (value, key) {
            return key < n;
        });
    }
    static range(list, k, n) {
        return ObservableList.filter(ObservableList.index(list), function (value, key) {
            return key >= k && key < n + k;
        });
    }
    static scan(list, scanFn, memo) {
        var { prev, next } = list, scanList;
        function get(key) {
            return scanList.prev(key).then(p => p == null ? memo : scanList.get(p)).then(memo => list.get(key).then(value => scanFn(memo, value)));
        }
        function observe(observer) {
            return list.observe({
                onInvalidate: function (prev, next) {
                    observer.onInvalidate(prev, null);
                }
            });
        }
        scanList = ObservableList.cache({ get, prev, next, observe });
        return scanList;
    }
}
export default ObservableList;
