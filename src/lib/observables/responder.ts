import {globalStack} from './global-stack'

/*
A Responder is an object that listens accesses to notifiers (observables). When these
notifiers change, the responder is run.

Could be a Computed or a reaction such as AutoRun.

 */
export interface Responder {
  // TODO: responder could say whether it cares about order???

  run(): void
}

export class AutoRun implements Responder {
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
