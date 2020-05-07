//

class TrackObservables {
  computeds = new Map<Computed<unknown>, ''>()

  computedStack: Computed<unknown>[] = []

  registerComputed(c: Computed<unknown>) {
    this.computeds.set(c, '')
    this.computedStack.push(c)
  }

  finishRegisterComputed() {
    this.computedStack.pop()
  }

  track(a: Atom<unknown>) {
    const len = this.computedStack.length

    if (len > 0) {
      this.computedStack[len - 1].track(a)
    }
  }
}

const t = new TrackObservables()

function obs<T>(value: T) {
  const a = new Atom(value)

  function inner(): T
  function inner(newValue: T): undefined
  function inner(newValue?: T) {
    if (arguments.length === 0) return a.get()

    if (newValue !== undefined) a.set(newValue)

    return undefined
  }
}

function computed<T>(f: () => T) {
  const c = new Computed(f)

  t.registerComputed(c)
  c.get()
  t.finishRegisterComputed()

  return () => {
    // TODO: Track
    return c.get()
  }
}

class Atom<T> {
  constructor(public value: T) {}

  get(): T {
    t.track(this)

    return this.value
  }

  set(value: T) {
    this.value = value
  }
}

class Computed<T> {
  observables = new Map<Atom<unknown>, ''>()

  result: T | null = null

  constructor(public f: () => T) {}

  track(a: Atom<unknown>) {
    this.observables.set(a, '')
  }

  get(): T {
    this.result = this.f()

    return this.result
  }
}
