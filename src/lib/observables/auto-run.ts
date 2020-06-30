import {subscriberStack} from './subscriber-stack'

export interface Subscriber {
  run(): void
}

export class AutoRun implements Subscriber {
  constructor(public f: () => void) {
    this.run()
  }

  run() {
    subscriberStack.pushSubscriber(this)
    subscriberStack.startAction()
    this.f()
    subscriberStack.endAction()
    subscriberStack.popSubscriber()
  }
}

export function autoRun(f: () => void, schedule?: () => void) {
  return new AutoRun(f)
}
