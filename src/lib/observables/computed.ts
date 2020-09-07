import {Notifier, notify, addCurrentResponderToThisNotifier} from './notifier'
import {globalStack} from './global-stack'
import {OrderedResponder, UnorderedResponder} from './responder'

/*
Notes:
Computed run can be scheduled, however, when it's called upon it needs to run immediately.

It could then still be scheduled for after action if other atoms notify it.

How do we pull it out of the queue?

Do we make it easy to find in the queue and remove?

I think action stack needs to be smarter.
  - We want to dedupe across actions
  - We want to be able to remove a notifier?

We could put computeds in a different queue?

Atom could have both reactions and computeds?

Current Plan:

When a computed is inside an action or autoRun and it gets an update notification:

It goes on the action stack.
If get is called on the computed, then we need to recalculate and remove it from action stack.
 */

export class Computed<T> implements UnorderedResponder, Notifier {
  ordered = false as const

  orderedResponders = new Map<string, OrderedResponder>()
  unorderedResponders = new Set<UnorderedResponder>()

  value: T | any
  firstRun = true

  constructor(public f: () => T) {
    // globalStack.pushResponder(this)
    // this.value = f()
    // globalStack.popResponder()
  }

  run(): void {
    globalStack.pushResponder(this)
    const result = this.f()
    globalStack.popResponder()

    // console.log('num responders: ', this.orderedResponders.size + this.unorderedResponders.size)

    if (result !== this.value) {
      this.value = result

      // TODO: Check if we have any responders first here or somewhere else
      notify(this)
    }
  }

  get(): T {
    if (this.firstRun) {
      globalStack.pushResponder(this)
      this.value = this.f()
      globalStack.popResponder()
      this.firstRun = false
    }
    globalStack.runComputedNowIfDirty(this)

    addCurrentResponderToThisNotifier(this)
    // const responder = globalStack.getCurrentResponder()
    //
    // // TODO: Do we need to make sure we aren't adding ourselves to ourself?
    // if (responder !== null) {
    //   addResponder(this, responder)
    // }

    return this.value
  }
}

export interface Calc<T> {
  (): Readonly<T>
  length: Symbol // This is to prevent accidental comparisons.
}

export function $Calc<T>(f: () => T): Calc<T> {
  const c = new Computed(f)

  return (() => {
    return c.get()
  }) as any
}
