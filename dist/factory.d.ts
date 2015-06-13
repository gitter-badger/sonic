import { List, IList } from './list';
import { ObservableList, IObservableList } from './observable_list';
import { MutableList, IMutableList } from './mutable_list';
import Unit from './unit';
import ArrayList from './array_list';
export default function factory<V, I>(obj: IMutableList<V>): MutableList<V>;
export default function factory<V, I>(obj: IObservableList<V>): ObservableList<V>;
export default function factory<V, I>(obj: IList<V>): List<V>;
export default function factory<V>(obj: V[]): ArrayList<V>;
export default function factory<V>(obj: V): Unit<V>;
export declare function fromPromise<V>(promise: Promise<V>): IObservableList<V>;
export declare function fromIterator<V>(iterator: Iterator<V>): IList<V>;
