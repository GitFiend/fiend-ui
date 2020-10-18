import {globalStack} from './global-stack'
import {$Component} from './$component'

/*
A Responder is an object that listens accesses to notifiers (observables). When these
notifiers change, the responder is run.

Could be a Computed or a reaction such as AutoRun.

 */

export enum ResponderType {
  computed,
  autoRun,
  reaction,
  component,
}

export type Responder = $Component | UnorderedResponder

export interface OrderedResponder {
  responderType: ResponderType
  ordered: true
  order: string
  run(): void
}

export interface UnorderedResponder {
  responderType: ResponderType
  ordered: false
  active: boolean
  run(): void
}

export type F0 = () => void

class AutoRun implements UnorderedResponder {
  responderType = ResponderType.autoRun as const
  ordered = false as const
  active = true

  constructor(public f: () => void) {
    this.run()
  }

  run() {
    if (!this.active) return

    globalStack.pushResponder(this)
    // globalStack.startAction()
    this.f()
    // globalStack.endAction()
    globalStack.popResponder()
  }

  end: F0 = () => {
    this.active = false
  }
}

export function $AutoRun(f: () => void): F0 {
  return new AutoRun(f).end
}

class Reaction<T> implements UnorderedResponder {
  responderType = ResponderType.reaction
  ordered = false as const
  value: T

  active = true

  constructor(private calc: () => T, private f: (result: T) => void) {
    globalStack.pushResponder(this)
    this.value = this.calc()
    globalStack.popResponder()
  }

  run(): void {
    if (!this.active) return

    globalStack.pushResponder(this)
    const value = this.calc()
    globalStack.popResponder()

    if (this.value !== value) {
      this.value = value

      // $RunInAction(() => {
      this.f(value)
      // })
    }
  }

  end: F0 = () => {
    this.active = false
  }
}

/*
A Reaction will keep going so long as the observables inside it's function still exist.

If a fiend class has a shorter lifetime than observables it depends on, they should be cleaned up.
 */
export function $Reaction<T>(calc: () => T, f: (result: T) => void): F0 {
  return new Reaction(calc, f).end
}
