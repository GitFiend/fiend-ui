import {reactionStack} from './reaction-stack'
import {Subscriber} from './reactions'
import {Notifier, notify} from './notifier'

export type Observable<T> = {(): T; (newValue: T): void}

// TODO: Rename to val?
export function obs<T>(value: T): Observable<T> {
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
    const r = reactionStack.getCurrentReaction()

    if (r !== null) {
      this.subscribers.add(r)
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

class Chi {
  $num = 5
  π = 4
}
