import {Atom, reactionStack} from './observables'

export function computed<T>(f: () => T) {
  const c = new Computed(f)

  return () => {
    // TODO: Track
    return c.get()
  }
}

export interface ZReaction {
  run(): void
}

export class Computed<T> implements ZReaction {
  observables = new Map<Atom<unknown>, ''>()

  result: T

  constructor(public f: () => T) {
    reactionStack.pushReaction(this)
    this.result = f()
    reactionStack.popReaction()
  }

  run(): void {
    reactionStack.pushReaction(this)
    this.result = this.f()
    reactionStack.popReaction()
  }

  get(): T {
    return this.result
  }
}

export class Reaction implements ZReaction {
  constructor(public f: () => void) {
    this.run()
  }

  run() {
    reactionStack.pushReaction(this)
    this.f()
    reactionStack.popReaction()
  }
}

export function autorun(f: () => void) {
  return new Reaction(f)
}
