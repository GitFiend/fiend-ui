import {globalStack} from './global-stack'
import {computed} from './computed'
import {runInAction} from './action'

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

  constructor(public f: () => void) {
    this.run()
  }

  run() {
    globalStack.pushResponder(this)
    globalStack.startAction()
    this.f()
    globalStack.endAction()
    globalStack.popResponder()
  }
}

export function autoRun(f: () => void) {
  return new AutoRun(f)
}

// class Reaction<T> {
//   c: () => T
//
//   constructor(calc: () => T, f: (result: T) => void) {
//     this.c = computed(calc)
//
//     autoRun(() => {
//       const result = this.c()
//
//       runInAction(() => {
//         f(result)
//       })
//     })
//   }
// }

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

      runInAction(() => {
        this.f(value)
      })
    }
  }
}

export function reaction<T>(calc: () => T, f: (result: T) => void) {
  return new Reaction(calc, f)
}
