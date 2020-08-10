import {Responder} from './responder'
import {Notifier} from './notifier'
import {ActionState} from './action'
import {Computed} from './computed'

export class GlobalStack {
  responderStack: Responder[] = []
  actionStack: ActionState[] = []

  /*
  We put a responder on a stack so that notifiers can register themselves
  with the current responder.
   */
  pushResponder(responder: Responder): void {
    this.responderStack.push(responder)
  }

  popResponder(): void {
    this.responderStack.pop()
  }

  getCurrentResponder(): Responder | null {
    const len = this.responderStack.length

    if (len > 0) {
      return this.responderStack[len - 1]
    }
    return null
  }

  queueNotifierIfInAction(notifier: Notifier): boolean {
    const numActions = this.actionStack.length

    if (numActions > 0) {
      this.actionStack[numActions - 1].add(notifier)

      return true
    }
    return false
  }

  // queueComponentUpdate(component: ZComponent) {
  //   const numActions = this.actionStack.length
  //
  //   if (numActions > 0) {
  //     this.actionStack[numActions - 1].addComponent(component)
  //   }
  // }

  insideAction(): boolean {
    return this.actionStack.length > 0
  }

  /*
  We don't wait till the end of an action before running a computed if accessed as
  computeds need to always return the correct value.
   */
  runComputedNowIfDirty(computed: Computed<unknown>) {
    if (this.insideAction()) {
      const action = last(this.actionStack)

      if (action !== undefined && action.unorderedResponders.delete(computed)) {
        computed.run()
      }
    }
  }

  startAction(): void {
    this.actionStack.push(new ActionState(this.getCurrentResponder()))
  }

  endAction(): void {
    const queue = this.actionStack.pop()

    queue?.run()
  }
}

export const globalStack = new GlobalStack()

function last<T>(array: T[]): T | undefined {
  return array[array.length - 1]
}
