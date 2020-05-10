import {reactionStack} from './reaction-stack'
import {Notifier, notify} from './notifier'
import {action} from './action'

export function computed<T>(f: () => T) {
  const c = new Computed(f)

  return () => {
    return c.get()
  }
}

export interface ZReaction {
  run(): void
}

export class Computed<T> implements ZReaction, Notifier {
  reactions = new Set<ZReaction>()

  result: T

  constructor(public f: () => T) {
    reactionStack.pushReaction(this)
    this.result = f()
    reactionStack.popReaction()
  }

  // TODO: Check for setting observables inside computeds and throw?
  run(): void {
    // action(() => {
    reactionStack.pushReaction(this)
    const result = this.f()

    if (result !== this.result) {
      this.result = result

      notify(this)
    }
    reactionStack.popReaction()
    // })
  }

  get(): T {
    const r = reactionStack.getCurrentReaction()

    if (r !== null) {
      this.reactions.add(r)
    }

    return this.result
  }
}

export class Reaction implements ZReaction {
  constructor(public f: () => void) {
    this.run()
  }

  run() {
    reactionStack.pushReaction(this)

    action(this.f)
    // this.f()
    reactionStack.popReaction()
  }
}

export function autorun(f: () => void) {
  return new Reaction(f)
}
