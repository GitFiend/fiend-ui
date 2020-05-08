import {Atom} from './observables'
import {Computed, Reaction} from './computed'

export class TrackObservables {
  computeds = new Map<Computed<unknown>, ''>()
  computedStack: Computed<unknown>[] = []

  reactions = new Map<Reaction, ''>()
  reactionStack: Reaction[] = []

  registerComputed(c: Computed<unknown>) {
    this.computeds.set(c, '')
    this.computedStack.push(c)
  }

  finishRegisterComputed() {
    this.computedStack.pop()
  }

  registerReaction(r: Reaction) {
    this.reactions.set(r, '')
    this.reactionStack.push(r)
  }

  finishRegisteringReaction() {
    this.reactionStack.pop()
  }

  getCurrentReaction(): Reaction | null {
    const len = this.reactionStack.length

    if (len > 0) {
      return this.reactionStack[len - 1]
    }
    return null
  }

  track(a: Atom<unknown>) {
    const len = this.reactionStack.length

    if (len > 0) {
      this.reactionStack[len - 1].track(a)
    }
  }
}
