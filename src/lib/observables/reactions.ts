import {reactionStack} from './reaction-stack'
import {Notifier, notify} from './notifier'

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
    reactionStack.pushReaction(this)
    const result = this.f()

    if (result !== this.result) {
      this.result = result

      notify(this)
    }
    reactionStack.popReaction()
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
