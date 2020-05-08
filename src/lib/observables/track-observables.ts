import {Atom} from './observables'
import {Computed, Reaction, ZReaction} from './computed'

export class TrackObservables {
  // computeds = new Map<Computed<unknown>, ''>()
  // computedStack: Computed<unknown>[] = []

  // reactions = new Map<Reaction, ''>()
  reactionStack: ZReaction[] = []

  // registerComputed(c: Computed<unknown>) {
  //   this.computeds.set(c, '')
  //   this.computedStack.push(c)
  // }
  //
  // finishRegisterComputed() {
  //   this.computedStack.pop()
  // }

  pushReaction(r: Reaction) {
    // this.reactions.set(r, '')
    this.reactionStack.push(r)
  }

  popReaction() {
    this.reactionStack.pop()
  }

  getCurrentReaction(): ZReaction | null {
    const len = this.reactionStack.length

    if (len > 0) {
      return this.reactionStack[len - 1]
    }
    return null
  }

  // track(a: Atom<unknown>) {
  //   const len = this.reactionStack.length
  //
  //   if (len > 0) {
  //     this.reactionStack[len - 1].track(a)
  //   }
  // }
}
