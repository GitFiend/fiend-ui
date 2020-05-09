import {reactionStack} from './observables'

export function computed<T>(f: () => T) {
  const c = new Computed(f)

  return () => {
    return c.get()
  }
}

export interface ZReaction {
  run(): void
}

export class Computed<T> implements ZReaction {
  reactions = new Set<ZReaction>()

  result: T

  constructor(public f: () => T) {
    reactionStack.pushReaction(this)
    this.result = f()
    reactionStack.popReaction()
  }

  run(): void {
    reactionStack.pushReaction(this)
    const result = this.f()

    if (result !== this.result) {
      this.result = result

      const reactions = this.reactions

      this.reactions = new Set<ZReaction>()

      for (const r of reactions) {
        r.run()
      }
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
