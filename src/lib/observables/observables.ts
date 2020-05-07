import {TrackObservables} from './track-observables'

//
export const t = new TrackObservables()

function obs<T>(value: T): {(): T; (newValue: T): void} {
  const a = new Atom(value)

  function inner(): T
  function inner(newValue: T): undefined
  function inner(newValue?: T) {
    if (arguments.length === 0) return a.get()

    if (newValue !== undefined) a.set(newValue)

    return
  }

  return inner
}

export class Atom<T> {
  constructor(public value: T) {}

  get(): T {
    t.track(this)

    return this.value
  }

  set(value: T) {
    this.value = value
  }
}

function autorun(f: () => void) {
  //
}
