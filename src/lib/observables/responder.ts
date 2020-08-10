import {globalStack} from './global-stack'
import {computed} from './computed'
import {runInAction} from './action'

/*
A Responder is an object that listens accesses to notifiers (observables). When these
notifiers change, the responder is run.

Could be a Computed or a reaction such as AutoRun.

 */
// export interface Responder {
//   // TODO: responder could say whether it cares about order???
//
//   run(): void
// }

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

export class Reaction<T> {
  c: () => T

  constructor(calc: () => T, f: (result: T) => void) {
    this.c = computed(calc)

    autoRun(() => {
      const result = this.c()

      runInAction(() => {
        f(result)
      })
    })
  }
}

export function reaction<T>(calc: () => T, f: (result: T) => void) {
  return new Reaction(calc, f)
}
