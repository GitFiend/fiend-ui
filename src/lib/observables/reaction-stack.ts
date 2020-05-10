import {Reaction, ZReaction} from './reactions'
import {Notifier, runNotifierQueue} from './notifier'

export class ReactionStack {
  stack: ZReaction[] = []

  actions = 0
  queuedNotifiers = new Set<Notifier>()
  runningNotifierQueue = false

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

  queueNotifier(notifier: Notifier) {
    this.queuedNotifiers.add(notifier)
  }

  insideAction(): boolean {
    return this.actions > 0
  }

  startAction(): void {
    if (this.runningNotifierQueue) return

    this.actions++
  }

  endAction(): void {
    if (this.runningNotifierQueue) return

    this.actions--

    if (this.actions === 0) {
      runNotifierQueue(this.queuedNotifiers)
    }
  }
}

export const reactionStack = new ReactionStack()
