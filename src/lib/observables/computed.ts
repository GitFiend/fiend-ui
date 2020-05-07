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
