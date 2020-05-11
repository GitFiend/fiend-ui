import {Reaction, Reactor} from './reactions'
import {Notifier, runActionQueue} from './notifier'

export class ReactionStack {
  stack: Reactor[] = []

  // notifierStack: Set<Notifier>[] = []
  actionStack: ActionState[] = []

  pushReaction(r: Reaction) {
    // console.log('pushReaction')
    this.stack.push(r)
  }

  popReaction() {
    this.stack.pop()
  }

  getCurrentReaction(): Reactor | null {
    const len = this.stack.length

    if (len > 0) {
      return this.stack[len - 1]
    }
    return null
  }

  queueNotifier(notifier: Notifier) {
    last(this.actionStack).notifiers.add(notifier)
    // this.notifierStack[this.notifierStack.length - 1].add(notifier)
  }

  insideAction(): boolean {
    return this.actionStack.length > 0
  }

  startAction(): void {
    // console.log('startAction')
    this.actionStack.push(new ActionState(this.getCurrentReaction()!))
    // this.notifierStack.push(new Set())
  }

  endAction(): void {
    const queue = this.actionStack.pop()

    if (queue !== undefined) runActionQueue(queue)
  }
}

export class ActionState {
  notifiers = new Set<Notifier>()

  constructor(public reactor: Reactor) {}
}

export const reactionStack = new ReactionStack()

function last<T>(array: T[]): T {
  return array[array.length - 1]
}
