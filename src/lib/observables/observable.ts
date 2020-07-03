import {globalStack} from './global-stack'
import {OrderedResponder, UnorderedResponder} from './responder'
import {addResponder, Notifier, notify} from './notifier'

export type Observable<T> = {(): T; (newValue: T): void}

export function val<T>(value: T): Observable<T> {
  const a = new Atom(value)

  function inner(): T
  function inner(newValue: T): undefined
  function inner(newValue?: T) {
    if (arguments.length === 0) return a.get()

    if (newValue !== undefined) a.set(newValue)

    return
  }

  return inner
}

export class Atom<T> implements Notifier {
  // responders = new Set<Responder>()
  orderedResponders = new Map<string, OrderedResponder>()
  unorderedResponders = new Set<UnorderedResponder>()

  constructor(public value: T) {}

  get(): T {
    const responder = globalStack.getCurrentResponder()

    if (responder !== null) {
      // TODO: distinguish between components and other responders?
      // this.responders.add(responder)
      addResponder(this, responder)
    }

    return this.value
  }

  set(value: T) {
    if (this.value !== value) {
      this.value = value

      notify(this)
    }
  }
}

// export function array<T>(value: T) {
//   const a = new Atom(value)
//
//   function inner(): T
//   function inner(newValue: T): undefined
//   function inner(newValue?: T) {
//     if (arguments.length === 0) return a.get()
//
//     if (newValue !== undefined) a.set(newValue)
//
//     return
//   }
//
//   return inner
// }
