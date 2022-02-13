import {UnorderedResponder} from './responder'
import {addCallingResponderToOurList, Notifier, notify} from './notifier'
import {$Component} from './$component'
import {RefObject} from '../util/ref'

export interface Observable<T> {
  (): Readonly<T>
  (newValue: T): T
  length: Symbol // We override length to be symbol to prevent accidental length checks.
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

export class Atom<T> implements Notifier {
  computeds = new Set<RefObject<UnorderedResponder>>()
  reactions = new Set<RefObject<UnorderedResponder>>()
  components = new Map<string, RefObject<$Component>>()

  constructor(public value: T) {}

  get(): T {
    addCallingResponderToOurList(this)

    return this.value
  }

  set(value: T) {
    if (this.value !== value) {
      this.value = value

      notify(this)
    }
  }
}
