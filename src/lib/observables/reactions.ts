import {reactionStack} from './reaction-stack'

export interface Subscriber {
  run(): void
}

export class Reaction implements Subscriber {
  constructor(public f: () => void) {
    this.run()
  }

  run() {
    reactionStack.pushReaction(this)
    reactionStack.startAction()
    this.f()
    reactionStack.endAction()
    reactionStack.popReaction()
  }
}

export function autoRun(f: () => void, schedule?: () => void) {
  return new Reaction(f)
}
