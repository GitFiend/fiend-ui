import {reactionStack} from './reaction-stack'
import {Notifier, notify} from './notifier'

// export type Computed<T> = () => T

export function computed<T>(f: () => T) {
  const c = new Computed(f)

  return () => {
    return c.get()
  }
}

export interface Reactor {
  run(): void
}

export class Computed<T> implements Reactor, Notifier {
  reactions = new Set<Reactor>()

  result: T

  constructor(public f: () => T) {
    reactionStack.pushReaction(this)
    this.result = f()
    reactionStack.popReaction()
  }

  // TODO: Check for setting observables inside computeds and throw?
  run(): void {
    console.log('run computed. action stack size: ', reactionStack.actionStack.length)

    reactionStack.pushReaction(this)
    const result = this.f()
    reactionStack.popReaction()

    if (result !== this.result) {
      this.result = result

      notify(this)
    }
  }

  get(): T {
    const r = reactionStack.getCurrentReaction()

    if (r !== null) {
      this.reactions.add(r)
    }

    return this.result
  }
}

export class Reaction implements Reactor {
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
