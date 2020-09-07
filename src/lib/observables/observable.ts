import {OrderedResponder, UnorderedResponder} from './responder'
import {Notifier, notify, addCurrentResponderToThisNotifier} from './notifier'

// export type Observable<T> = {(): Readonly<T>; (newValue: T): void; length: unknown}
export interface Observable<T> {
  (): Readonly<T>
  (newValue: T): T
  length: Symbol
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

  return inner as any
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

  return inner as any
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

  return inner as any
}

export class Atom<T> implements Notifier {
  // responders = new Set<Responder>()
  orderedResponders = new Map<string, OrderedResponder>()
  unorderedResponders = new Set<UnorderedResponder>()

  constructor(public value: T) {}

  get(): T {
    addCurrentResponderToThisNotifier(this)
    // const responder = globalStack.getCurrentResponder()
    //
    // if (responder !== null) {
    //   // TODO: distinguish between components and other responders?
    //   // this.responders.add(responder)
    //   addResponder(this, responder)
    // }

    return this.value
  }

  set(value: T) {
    if (this.value !== value) {
      this.value = value

      notify(this)
    }
  }
}
