import {addCallingResponderToOurList, Notifier, notify} from './notifier'
import {globalStack} from './global-stack'
import {ResponderType, UnorderedResponder} from './responder'
import {$Component} from './$component'

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
  responderType = ResponderType.computed as const
  ordered = false as const

  computeds = new Set<UnorderedResponder>()
  reactions = new Set<UnorderedResponder>()
  components = new Map<string, $Component>()

  value: T | any
  firstRun = true

  active = false

  constructor(public f: () => T) {}

  run(): void {
    if (!this.active) {
      this.computeds.clear()
      this.reactions.clear()
      this.components.clear()
      return
    }

    globalStack.pushResponder(this)
    const result = this.f()
    globalStack.popResponder()

    if (result !== this.value) {
      this.value = result

      // TODO: Check if we have any responders first here or somewhere else
      notify(this)
    }
  }

  get(): T {
    if (this.firstRun || !this.active) {
      globalStack.pushResponder(this)
      this.value = this.f()
      globalStack.popResponder()
      this.firstRun = false
    } else {
      globalStack.runComputedNowIfDirty(this)
    }

    addCallingResponderToOurList(this)

    // this.active = globalStack.insideNonComputedResponder()
    // TODO: Not sure whether there's a computed/memory leak here or not.
    this.active = true

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
