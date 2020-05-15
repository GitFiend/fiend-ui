import {Subscriber} from './reactions'
import {Notifier} from './notifier'

export class ReactionStack {
  stack: Subscriber[] = []

  actionStack: ActionState[] = []

  pushReaction(r: Subscriber): void {
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
    last(this.actionStack).add(notifier)
  }

  insideAction(): boolean {
    return this.actionStack.length > 0
  }

  actionHasSubscriber(subscriber: Subscriber): boolean {
    return this.insideAction() && last(this.actionStack).subscribers.delete(subscriber)
  }

  startAction(): void {
    this.actionStack.push(new ActionState(this.getCurrentReaction()))
  }

  endAction(): void {
    const queue = this.actionStack.pop()

    queue?.run()
  }
}

export class ActionState {
  subscribers = new Set<Subscriber>()

  constructor(public runningSubscriber: Subscriber | null) {}

  add(notifier: Notifier) {
    for (const s of notifier.subscribers) {
      if (s !== this.runningSubscriber) {
        this.subscribers.add(s)
      }
    }
  }

  run() {
    for (const s of this.subscribers) {
      s.run()
    }
  }
}

export const reactionStack = new ReactionStack()

function last<T>(array: T[]): T {
  return array[array.length - 1]
}
