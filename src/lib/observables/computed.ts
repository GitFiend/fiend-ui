import {addCallingResponderToOurList, clearNotifier, Notifier, notify} from './notifier'
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
  // firstRun = true

  // numResponders = 0

  active = false

  // hasResponders = false

  constructor(public f: () => T) {}

  run(): void {
    // console.log(
    //   'num responders in computed: ',
    //   this.computeds.size + this.reactions.size + this.components.size
    // )
    // this.hasResponders = this.numResponders() > 0

    if (this.hasActiveResponders()) {
      globalStack.pushResponder(this)
      const result = this.f()
      this.active = this.hasActiveResponders()

      globalStack.popResponder()

      if (result !== this.value) {
        this.value = result

        notify(this)
      }
    }

    // if (!this.active) {
    //   this.computeds.clear()
    //   this.reactions.clear()
    //   this.components.clear()
    //   return
    // }
    //
    // globalStack.pushResponder(this)
    // const result = this.f()
    // globalStack.popResponder()
    //
    // if (result !== this.value) {
    //   this.value = result
    //
    //   notify(this)
    // }
  }

  get(): T {
    if (!this.active) {
      globalStack.pushResponder(this)
      this.value = this.f()
      this.active = this.hasActiveResponders()

      globalStack.popResponder()
      // this.hasResponders = this.numResponders() > 0
    } else {
      globalStack.runComputedNowIfDirty(this)
    }

    // if (this.firstRun || !this.active) {
    //   globalStack.pushResponder(this)
    //   this.value = this.f()
    //   globalStack.popResponder()
    //   this.firstRun = false
    // } else {
    //   globalStack.runComputedNowIfDirty(this)
    // }

    addCallingResponderToOurList(this)

    // this.active = globalStack.insideNonComputedResponder()
    // TODO: Not sure whether there's a computed/memory leak here or not.
    // this.active = true

    return this.value
  }

  hasActiveResponders(): boolean {
    // TODO: Optimise this before committing.
    for (const c of this.computeds) {
      if (!c.active) {
        this.computeds.delete(c)
      }
    }
    for (const c of this.reactions) {
      if (!c.active) {
        this.reactions.delete(c)
      }
    }
    for (const [key, c] of this.components) {
      if (c._removed) {
        this.components.delete(key)
      }
    }

    for (const c of this.computeds) {
      if (c.active) return true
    }

    for (const r of this.reactions) {
      if (r.active) return true
    }

    // if (this.components.size > 0) {
    //   console.log('just component')
    for (const [, c] of this.components) {
      if (!c._removed) {
        // console.log('REMOVED WTF!')
        return true
      }
    }
    // return true
    // }

    clearNotifier(this)

    // if (this.computeds.size + this.reactions.size + this.components.size > 0) {
    //   console.log('OMGOMGOMGOMG')
    // }
    return false
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
