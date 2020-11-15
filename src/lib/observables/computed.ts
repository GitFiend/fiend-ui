import {addCallingResponderToOurList, Notifier, notify} from './notifier'
import {globalStack} from './global-stack'
import {ResponderType, UnorderedResponder} from './responder'
import {$Component} from './$component'
import {RefObject} from '../util/ref'

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

  // Things we call when this computed updates.
  computeds = new Set<RefObject<UnorderedResponder>>()
  reactions = new Set<RefObject<UnorderedResponder>>()
  components = new Map<string, RefObject<$Component>>()

  // Things that call this computed when they update.
  // notifiers = new Set<RefObject<Notifier>>()

  value: T | any

  _ref: RefObject<this> = {
    current: this,
  }

  // firstRun = true
  dirty = true

  constructor(public f: () => T) {}

  run(): void {
    this.dirty = true

    if (this.hasActiveResponders()) {
      globalStack.pushResponder(this)
      const result = this.f()
      this.dirty = false
      globalStack.popResponder()

      this._ref.current = this.hasActiveResponders() ? this : null

      if (result !== this.value) {
        this.value = result

        notify(this)
      }
    }
  }

  get(): T {
    if (this._ref.current === null || this.dirty) {
      globalStack.pushResponder(this)
      this.value = this.f()
      this.dirty = false
      globalStack.popResponder()
    } else {
      globalStack.runComputedNowIfDirty(this._ref)
    }

    addCallingResponderToOurList(this)
    this._ref.current = this.hasActiveResponders() ? this : null

    return this.value
  }

  hasActiveResponders(): boolean {
    for (const c of this.computeds) {
      if (c.current !== null) return true
    }
    for (const r of this.reactions) {
      if (r.current !== null) return true
    }
    for (const [, c] of this.components) {
      if (c.current !== null) {
        return true
      }
    }
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
