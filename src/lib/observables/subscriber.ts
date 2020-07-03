import {globalStack} from './global-stack'

/*
A Subscriber is an object that listens accesses to notifiers (observables). When these
notifiers change, the subscriber is run.

Could be a Computed or a reaction such as AutoRun.

 */
export interface Subscriber {
  run(): void
}

export class AutoRun implements Subscriber {
  constructor(public f: () => void) {
    this.run()
  }

  run() {
    globalStack.pushSubscriber(this)
    globalStack.startAction()
    this.f()
    globalStack.endAction()
    globalStack.popSubscriber()
  }
}

export function autoRun(f: () => void) {
  return new AutoRun(f)
}
