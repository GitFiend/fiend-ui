import {Responder, ResponderType} from './responder'
import {Notifier} from './notifier'
import {ActionState} from './action'
import {Computed} from './computed'
import {RefObject} from '../util/ref'

export class GlobalStack {
  private responderStack: Responder[] = []
  private actionStack: ActionState | null = null
  private actionDepth = 0

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
    if (this.actionStack !== null) {
      this.actionStack.add(notifier)

      return true
    }
    return false
  }

  // "Inside reactive context"
  insideNonComputedResponder(): boolean {
    return this.responderStack.some(r => r.responderType !== ResponderType.computed)
  }

  /*
  We don't wait till the end of an action before running a computed if accessed as
  computeds need to always return the correct value.
   */
  runComputedNowIfDirty(computed: RefObject<Computed<unknown>>): boolean {
    if (this.actionStack?.computeds.delete(computed) === true) {
      computed.current?.run()
      return true
    }
    return false
  }

  startAction(): void {
    this.actionDepth++

    if (this.actionStack === null) {
      this.actionStack = new ActionState(this.getCurrentResponder())
    } else {
      this.actionStack.runningResponder = this.getCurrentResponder()
    }
  }

  endAction(): void {
    this.actionDepth--

    if (this.actionDepth === 0) {
      if (this.actionStack !== null) {
        const action = this.actionStack
        this.actionStack = null
        action.run()
      }
    }
  }
}

export const globalStack = new GlobalStack()
