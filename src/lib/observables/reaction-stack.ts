import {Reaction, ZReaction} from './reactions'

export class ReactionStack {
  stack: ZReaction[] = []

  pushReaction(r: Reaction) {
    this.stack.push(r)
  }

  popReaction() {
    this.stack.pop()
  }

  getCurrentReaction(): ZReaction | null {
    const len = this.stack.length

    if (len > 0) {
      return this.stack[len - 1]
    }
    return null
  }
}
