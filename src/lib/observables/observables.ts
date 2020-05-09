import {ReactionStack} from './reaction-stack'
import {ZReaction} from './computed'

//
export const reactionStack = new ReactionStack()

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
  // reactions: ZReaction[] = []
  reactions = new Set<ZReaction>()

  constructor(public value: T) {}

  get(): T {
    const r = reactionStack.getCurrentReaction()

    if (r !== null) {
      this.reactions.add(r)
      // this.reactions.push(r)
    }

    return this.value
  }

  set(value: T) {
    if (this.value !== value) {
      this.value = value

      const reactions = this.reactions

      this.reactions = new Set<ZReaction>()

      for (const r of reactions) {
        r.run()
      }
    }
  }
}
