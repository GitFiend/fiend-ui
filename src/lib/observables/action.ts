import {globalStack} from './global-stack'
import {OrderedResponder, Responder, UnorderedResponder} from './responder'
import {Notifier, runResponders} from './notifier'
import {ZComponent} from './z-component'

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
  unorderedResponders = new Set<UnorderedResponder>()
  orderedResponders = new Map<string, OrderedResponder>()

  constructor(public runningResponder: Responder | null) {}

  add(notifier: Notifier) {
    for (const r of notifier.unorderedResponders) {
      if (r !== this.runningResponder) this.unorderedResponders.add(r)
    }
    for (const [key, r] of notifier.orderedResponders) {
      if (r !== this.runningResponder) this.orderedResponders.set(key, r)
    }

    // for (const s of notifier.responders) {
    //   if (s !== this.runningResponder) {
    //     if (s.ordered)
    //       this.orderedResponders.add(s)
    //     else
    //       this.unorderedResponders.add(s)
    //   }
    // }
  }

  // This whole object gets deleted after running, so I don't think cleanup is required.
  run() {
    runResponders(this.unorderedResponders, this.orderedResponders)

    // for (const s of this.unorderedResponders) {
    //   s.run()
    // }
    // for (const s of this.orderedResponders) {
    //   s.run()
    // }
    // for (const s of this.responders) {
    //   s.run()
    // }
  }
}
