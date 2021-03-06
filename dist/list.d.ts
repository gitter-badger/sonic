import Key from './key';
import Range from './range';
import { ITree } from './tree';
export interface IList<V> {
    get: (key: Key) => Promise<V>;
    prev: (key?: Key) => Promise<Key>;
    next: (key?: Key) => Promise<Key>;
}
export declare abstract class List<V> implements IList<V> {
    abstract get(key: Key): Promise<V>;
    abstract prev(key?: Key): Promise<Key>;
    abstract next(key?: Key): Promise<Key>;
    static create<V>(list: IList<V>): List<V>;
    first(): Promise<V>;
    last(): Promise<V>;
    every(predicate: (value: V, key?: Key) => boolean): Promise<boolean>;
    some(predicate: (value: V, key?: Key) => boolean | Promise<boolean>): Promise<boolean>;
    forEach(fn: (value: V, key?: Key) => void, range?: Range): Promise<void>;
    reduce<W>(fn: (memo: W, value: V, key?: Key) => W, memo?: W, range?: Range): Promise<W>;
    toArray(range?: Range): Promise<V[]>;
    findKey(fn: (value: V, key?: Key) => boolean | Promise<boolean>, range?: Range): Promise<Key>;
    find(fn: (value: V, key?: Key) => boolean, range?: Range): Promise<V>;
    keyOf(value: V, range?: Range): Promise<Key>;
    indexOf(value: V, range?: Range): Promise<Key>;
    keyAt(index: number, range?: Range): Promise<Key>;
    at(index: number, range?: Range): Promise<V>;
    contains(value: V, range?: Range): Promise<boolean>;
    reverse(): List<V>;
    map<W>(mapFn: (value: V, key?: Key) => W): List<W>;
    filter(filterFn: (value: V, key?: Key) => boolean): List<V>;
    flatten(): List<any>;
    flatMap<W>(flatMapFn: (value: V, key?: Key) => IList<W>): List<W>;
    cache(): List<V>;
    group(groupFn: (value: V, key: Key) => Key): List<List<V>>;
    index(): List<V>;
    zip<W, U>(other: IList<W>, zipFn: (v: V, w: W) => U): List<U>;
    skip(k: number): IList<V>;
    take(n: number): IList<V>;
    range(k: number, n: number): IList<V>;
    scan<W>(scanFn: (memo: W, value: V) => W, memo?: W): IList<W>;
    static isList(obj: any): boolean;
    static first<V>(list: IList<V>): Promise<V>;
    static last<V>(list: IList<V>): Promise<V>;
    static every<V>(list: IList<V>, predicate: (value: V, key?: Key) => boolean | Promise<boolean>, range?: Range): Promise<boolean>;
    static some<V>(list: IList<V>, predicate: (value: V, key?: Key) => boolean | Promise<boolean>, range?: Range): Promise<boolean>;
    static forEach<V>(list: IList<V>, fn: (value: V, key?: Key) => void | Promise<void>, range?: Range): Promise<void>;
    static reduce<V, W>(list: IList<V>, fn: (memo: W, value: V, key?: Key) => W | Promise<W>, memo?: W, range?: Range): Promise<W>;
    static toArray<V>(list: IList<V>, range?: Range): Promise<V[]>;
    static findKey<V>(list: IList<V>, fn: (value: V, key?: Key) => boolean | Promise<boolean>, range?: Range): Promise<Key>;
    static find<V>(list: IList<V>, fn: (value: V, key?: Key) => boolean | Promise<boolean>, range?: Range): Promise<V>;
    static keyOf<V>(list: IList<V>, value: V, range?: Range): Promise<Key>;
    static indexOf<V>(list: IList<V>, value: V, range?: Range): Promise<number>;
    static keyAt<V>(list: IList<V>, index: number, range?: Range): Promise<Key>;
    static at<V>(list: IList<V>, index: number, range?: Range): Promise<V>;
    static contains<V>(list: IList<V>, value: V, range?: Range): Promise<boolean>;
    static reverse<V>(list: IList<V>): IList<V>;
    static map<V, W>(list: IList<V>, mapFn: (value: V, key?: Key) => W | Promise<W>): IList<W>;
    static filter<V>(list: IList<V>, filterFn: (value: V, key?: Key) => boolean): IList<V>;
    static flatten<V>(list: ITree<V>): ITree<V>;
    static flatMap<V, W>(list: IList<V>, flatMapFn: (value: V, key?: Key) => IList<W>): IList<W>;
    static cache<V>(list: IList<V>): IList<V>;
    static group<V>(list: IList<V>, groupFn: (value: V, key: Key) => Key): IList<IList<V>>;
    static index<V>(list: IList<V>): IList<V>;
    static zip<V, W, U>(list: IList<V>, other: IList<W>, zipFn: (v: V, w: W) => U): IList<U>;
    static skip<V>(list: IList<V>, k: number): IList<V>;
    static take<V>(list: IList<V>, n: number): IList<V>;
    static range<V>(list: IList<V>, k: number, n: number): IList<V>;
    static scan<V, W>(list: IList<V>, scanFn: (memo: W, value: V, key?: Key) => W, memo?: W): IList<W>;
}
export default List;
