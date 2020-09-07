import {globalStack} from './global-stack'
import {$Calc} from './computed'
import {$RunInAction} from './action'

/*
A Responder is an object that listens accesses to notifiers (observables). When these
notifiers change, the responder is run.

Could be a Computed or a reaction such as AutoRun.

 */

export type Responder = OrderedResponder | UnorderedResponder

export interface OrderedResponder {
  ordered: true
  order: string
  run(): void
}

export interface UnorderedResponder {
  ordered: false
  run(): void
}

export class AutoRun implements UnorderedResponder {
  ordered = false as const
  active = true

  constructor(public f: () => void) {
    this.run()
  }

  run() {
    if (!this.active) return

    globalStack.pushResponder(this)
    globalStack.startAction()
    this.f()
    globalStack.endAction()
    globalStack.popResponder()
  }

  end() {
    this.active = false
  }
}

export function $AutoRun(f: () => void) {
  return new AutoRun(f)
}

class Reaction<T> implements UnorderedResponder {
  ordered = false as const
  value: T

  constructor(private calc: () => T, private f: (result: T) => void) {
    globalStack.pushResponder(this)
    this.value = this.calc()
    globalStack.popResponder()
  }

  run(): void {
    globalStack.pushResponder(this)
    const value = this.calc()
    globalStack.popResponder()

    if (this.value !== value) {
      this.value = value

      $RunInAction(() => {
        this.f(value)
      })
    }
  }
}

export function $Reaction<T>(calc: () => T, f: (result: T) => void) {
  return new Reaction(calc, f)
}
