import {globalStack} from './global-stack'
import {$Component} from './$component'
import {RefObject} from '../util/ref'

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
  _ref: RefObject<$Component>
}

export interface UnorderedResponder {
  responderType: ResponderType
  ordered: false
  run(): void
  _ref: RefObject<UnorderedResponder>
}

export type F0 = () => void

class AutoRun implements UnorderedResponder {
  responderType = ResponderType.autoRun as const
  ordered = false as const

  _ref: RefObject<this> = {
    current: this,
  }

  constructor(public f: () => void) {
    this.run()
  }

  run() {
    if (this._ref.current === null) return

    globalStack.pushResponder(this)
    this.f()
    globalStack.popResponder()
  }

  end: F0 = () => {
    this._ref.current = null
    // this._ref = {current: null}
  }
}

export function $AutoRun(f: () => void): F0 {
  return new AutoRun(f).end
}

class Reaction<T> implements UnorderedResponder {
  responderType = ResponderType.reaction
  ordered = false as const
  value: T

  _ref: RefObject<this> = {
    current: this,
  }

  constructor(private calc: () => T, private f: (result: T) => void) {
    globalStack.pushResponder(this)
    this.value = this.calc()
    globalStack.popResponder()
  }

  run(): void {
    if (this._ref.current === null) return

    globalStack.pushResponder(this)
    const value = this.calc()
    globalStack.popResponder()

    if (this.value !== value) {
      this.value = value

      this.f(value)
    }
  }

  end: F0 = () => {
    this._ref.current = null
    // this._ref = {current: null}
  }
}

/*
A Reaction will keep going so long as the observables inside it's function still exist.

If a fiend class has a shorter lifetime than observables it depends on, they should be cleaned up.
 */
export function $Reaction<T>(calc: () => T, f: (result: T) => void): F0 {
  return new Reaction(calc, f).end
}
