import {reactionStack} from './reaction-stack'
import {ZReaction} from './reactions'
import {Notifier, notify} from './notifier'

export function obs<T>(value: T): {(): T; (newValue: T): void} {
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
  reactions = new Set<ZReaction>()

  constructor(public value: T) {}

  get(): T {
    const r = reactionStack.getCurrentReaction()

    if (r !== null) {
      this.reactions.add(r)
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
