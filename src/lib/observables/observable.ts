import {OrderedResponder, UnorderedResponder} from './responder'
import {addCurrentResponderToOurList, Notifier, notify} from './notifier'

export interface Observable<T> {
  (): Readonly<T>
  (newValue: T): T
  length: Symbol // We override length to be symbol to prevent accidental length checks.
}

export interface ObservableArray<T> {
  (): ReadonlyArray<T>
  (newValue: T[]): T
  length: Symbol
}

export interface ObservableMap<K, V> {
  (): ReadonlyMap<K, V>
  (newValue: Map<K, V>): ReadonlyMap<K, V>
  length: Symbol
}

export function $Val<T>(value: T): Observable<T> {
  const a = new Atom(value)

  function inner(): T
  function inner(newValue: T): T
  function inner(newValue?: T) {
    if (arguments.length === 0) return a.get()

    if (newValue !== undefined) a.set(newValue)

    return newValue
  }

  return inner as Observable<T>
}

export function $Map<K, V>(
  entries?: readonly (readonly [K, V])[] | null
): ObservableMap<K, V> {
  const map = new Map<K, V>(entries)

  const a = new Atom(map)

  function inner(): ReadonlyMap<K, V>
  function inner(newValue: Map<K, V>): ReadonlyMap<K, V>
  function inner(newValue?: Map<K, V>) {
    if (arguments.length === 0) return a.get() as ReadonlyMap<K, V>

    if (newValue !== undefined) a.set(newValue)

    return newValue
  }

  return inner as ObservableMap<K, V>
}

export function $Array<T>(...items: T[]): ObservableArray<T> {
  const a = new Atom(items)

  function inner(): ReadonlyArray<T>
  function inner(newValue: T[]): ReadonlyArray<T>
  function inner(newValue?: T[]) {
    if (arguments.length === 0) return a.get() as ReadonlyArray<T>

    if (newValue !== undefined) a.set(newValue)

    return newValue
  }

  return inner as ObservableArray<T>
}

export class Atom<T> implements Notifier {
  orderedResponders = new Map<string, OrderedResponder>()
  unorderedResponders = new Set<UnorderedResponder>()

  constructor(public value: T) {}

  get(): T {
    addCurrentResponderToOurList(this)

    return this.value
  }

  set(value: T) {
    if (this.value !== value) {
      this.value = value

      notify(this)
    }
  }
}
