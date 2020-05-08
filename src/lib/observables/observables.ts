import {TrackObservables} from './track-observables'
import {Reaction} from './computed'

//
export const t = new TrackObservables()

export function obs<T>(value: T): {(): T; (newValue: T): void} {
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
  reactions = new Map<Reaction, ''>()

  constructor(public value: T) {}

  get(): T {
    const r = t.getCurrentReaction()

    if (r !== null) {
      this.reactions.set(r, '')
    }

    return this.value
  }

  set(value: T) {
    this.value = value

    this.reactions.forEach((_, r) => {
      // this.reactions.delete(r)
      r.run()
    })
  }
}
