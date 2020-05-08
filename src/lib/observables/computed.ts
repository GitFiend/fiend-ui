import {Atom, t} from './observables'

export function computed<T>(f: () => T) {
  const c = new Computed(f)

  return () => {
    // TODO: Track
    return c.get()
  }
}

export class Computed<T> {
  observables = new Map<Atom<unknown>, ''>()

  result: T | null = null

  constructor(public f: () => T) {
    t.registerComputed(this)
    this.get()
    t.finishRegisterComputed()
  }

  track(a: Atom<unknown>) {
    this.observables.set(a, '')
  }

  get(): T {
    this.result = this.f()

    return this.result
  }
}

export class Reaction {
  // An array might do.
  observables = new Map<Atom<unknown>, ''>()

  constructor(public f: () => void) {
    t.registerReaction(this)
    this.run()
    t.finishRegisteringReaction()
  }

  track(a: Atom<unknown>) {
    this.observables.set(a, '')
  }

  run() {
    this.f()
  }
}

export function autorun(f: () => void) {
  return new Reaction(f)
}
