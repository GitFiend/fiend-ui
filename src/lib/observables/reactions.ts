import {reactionStack} from './reaction-stack'

// export type Computed<T> = () => T

export interface Subscriber {
  run(): void
}

export class Reaction implements Subscriber {
  constructor(public f: () => void) {
    this.run()
  }

  run() {
    // console.log(`Running ${this.name}`)

    reactionStack.pushReaction(this)
    reactionStack.startAction()
    this.f()
    reactionStack.endAction()
    reactionStack.popReaction()
  }
}

export function autorun(f: () => void) {
  return new Reaction(f)
}
