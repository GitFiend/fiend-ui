import {globalStack} from './global-stack'
import {Subscriber} from './subscriber'
import {Notifier} from './notifier'

//
export function runInAction(f: () => void) {
  globalStack.startAction()
  f()
  globalStack.endAction()
}

/**
 * Wraps passed in function in an action. Keeps the same type signature.
 *
 * E.g
 * const square = action((n: number) => n * n)
 *
 * @param f
 */
export const action = <T extends unknown[], U>(f: (...args: T) => U) => {
  return (...args: T): U => {
    globalStack.startAction()
    const result = f(...args)
    globalStack.endAction()

    return result
  }
}

/*
An Action lets us batch our notifiers.

 */
export class ActionState {
  subscribers = new Set<Subscriber>()

  constructor(public runningSubscriber: Subscriber | null) {}

  add(notifier: Notifier) {
    for (const s of notifier.subscribers) {
      if (s !== this.runningSubscriber) {
        this.subscribers.add(s)
      }
    }
  }

  run() {
    for (const s of this.subscribers) {
      s.run()
    }
  }
}
