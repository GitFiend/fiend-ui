import {addCallingResponderToOurList, clearNotifier, Notifier, notify} from './notifier'
import {globalStack} from './global-stack'
import {Responder, ResponderType, UnorderedResponder} from './responder'
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
  computeds = new Set<RefObject<Computed<unknown>>>()
  reactions = new Set<RefObject<UnorderedResponder>>()
  components = new Map<string, RefObject<$Component>>()

  // Things that call this computed when they update.
  // notifiers = new Set<RefObject<Notifier>>()

  value: T | any

  _ref: RefObject<this> = {
    current: this,
  }

  private dirty = true

  constructor(public f: () => T, public name: string) {
    count++
  }

  run(): void {
    this.dirty = true

    if (this.hasActiveResponders()) {
      globalStack.pushResponder(this)
      const result = this.f()
      this.dirty = false
      globalStack.popResponder()

      this.activate(this.hasActiveResponders())

      if (result !== this.value) {
        this.value = result

        notify(this)
      }
    } else {
      this.activate(false)
    }
  }

  get(responder: Responder | null): T {
    if (this._ref.current === null || this.dirty) {
      globalStack.pushResponder(this)
      this.value = this.f()
      this.dirty = false
      globalStack.popResponder()
    } else {
      globalStack.runComputedNowIfInActionStack(this._ref)
    }

    if (responder !== null) {
      addCallingResponderToOurList(this, responder)
    }

    // TODO: Why? Is this because the responder hasn't finished becoming active yet?
    this.activate(responder !== null || this.hasActiveResponders())

    return this.value
  }

  hasActiveResponders(deep = false): boolean {
    for (const r of this.reactions) {
      if (r.current !== null) return true
    }

    for (const c of this.components.values()) {
      if (c.current !== null) {
        return true
      }
    }
    if (deep) {
      for (const c of this.computeds) {
        if (c.current?.hasActiveResponders() === true) {
          return true
        }
      }
    } else {
      for (const r of this.computeds) {
        if (r.current !== null) return true
      }
    }

    // clearNotifier(this)
    return false
  }

  activate(shouldActivate: boolean) {
    if (shouldActivate) {
      if (this._ref.current === null) {
        console.log(`${this.name} on`)
        count++
        this._ref.current = this
      }
    } else {
      if (this._ref.current !== null) {
        count--
        console.log(`${this.name} off, ${count}`)
        this._ref.current = null

        // TODO: Is something like this required?
        this._ref = {current: null}
        clearNotifier(this)
      }
    }
  }
}

let count = 0

export interface Calc<T> {
  (): Readonly<T>
  length: Symbol // This is to prevent accidental comparisons.
}

export function $Calc<T>(f: () => T): Calc<T> {
  const c = new Computed(f, f.name)

  return (() => {
    return c.get(globalStack.getCurrentResponder())
  }) as any
}
