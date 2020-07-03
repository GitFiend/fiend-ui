import {globalStack} from './global-stack'
import {Subscriber} from './subscriber'
import {Notifier, notify} from './notifier'

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
  subscribers = new Set<Subscriber>()

  constructor(public value: T) {}

  get(): T {
    const subscriber = globalStack.getCurrentSubscriber()

    if (subscriber !== null) {
      // TODO: distinguish between components and other subscribers?
      this.subscribers.add(subscriber)
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
