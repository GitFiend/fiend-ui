import {Atom, t} from './observables'

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
    t.pushReaction(this)
    this.result = f()
    t.popReaction()
  }

  run(): void {
    t.pushReaction(this)
    this.result = this.f()
    t.popReaction()
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
    t.pushReaction(this)
    this.f()
    t.popReaction()
  }
}

export function autorun(f: () => void) {
  return new Reaction(f)
}
