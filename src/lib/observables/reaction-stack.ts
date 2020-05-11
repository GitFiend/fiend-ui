import {Reaction, Subscriber} from './reactions'
import {Notifier, runActionQueue} from './notifier'

export class ReactionStack {
  stack: Subscriber[] = []

  actionStack: ActionState[] = []

  pushReaction(r: Reaction): void {
    this.stack.push(r)
  }

  popReaction(): void {
    this.stack.pop()
  }

  getCurrentReaction(): Subscriber | null {
    const len = this.stack.length

    if (len > 0) {
      return this.stack[len - 1]
    }
    return null
  }

  queueNotifier(notifier: Notifier): void {
    last(this.actionStack).notifiers.add(notifier)
  }

  insideAction(): boolean {
    return this.actionStack.length > 0
  }

  startAction(): void {
    if (this.stack.length === 0) {
      console.log('starting action with no reaction!')
    }
    this.actionStack.push(new ActionState(this.getCurrentReaction()!))
  }

  endAction(): void {
    const queue = this.actionStack.pop()

    if (queue !== undefined) runActionQueue(queue)
  }
}

export class ActionState {
  notifiers = new Set<Notifier>()

  constructor(public reactor: Subscriber) {}
}

export const reactionStack = new ReactionStack()

function last<T>(array: T[]): T {
  return array[array.length - 1]
}
