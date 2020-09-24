import {Responder, ResponderType} from './responder'
import {Notifier} from './notifier'
import {ActionState} from './action'
import {Computed} from './computed'

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

    // const numActions = this.actionStack.length
    //
    // if (numActions > 0) {
    //   this.actionStack[numActions - 1].add(notifier)
    //
    //   return true
    // }
    // return false
  }

  // queueComponentUpdate(component: ZComponent) {
  //   const numActions = this.actionStack.length
  //
  //   if (numActions > 0) {
  //     this.actionStack[numActions - 1].addComponent(component)
  //   }
  // }

  // "Inside reactive context"
  insideNonComputedResponder(): boolean {
    return this.responderStack.some(r => r.type !== ResponderType.computed)
  }

  insideAction(): boolean {
    // return this.actionStack.length > 0
    return this.actionStack !== null
  }

  /*
  We don't wait till the end of an action before running a computed if accessed as
  computeds need to always return the correct value.
   */
  runComputedNowIfDirty(computed: Computed<unknown>) {
    // if (this.insideAction()) {
    // const action = last(this.actionStack)

    if (this.actionStack?.unorderedResponders.delete(computed) === true) {
      computed.run()
    }
    // }
  }

  startAction(): void {
    this.actionDepth++
    // console.log(this.actionDepth)

    if (this.actionStack === null) {
      this.actionStack = new ActionState(this.getCurrentResponder())
    } else {
      this.actionStack.runningResponder = this.getCurrentResponder()
    }
    // this.actionStack.push(new ActionState(this.getCurrentResponder()))
    // console.log('actionStack.length: ', this.actionStack.length)
  }

  endAction(): void {
    this.actionDepth--
    // console.log(this.actionDepth)

    if (this.actionDepth === 0) {
      // console.log(JSON.stringify(this.actionStack))
      // console.log(this.actionStack)

      if (this.actionStack !== null) {
        const action = this.actionStack
        this.actionStack = null
        action.run()
      }
      // this.actionStack?.run()
      // this.actionStack = null
    }

    // const queue = this.actionStack.pop()
    // console.log('actionStack.length: ', this.actionStack.length)
    //
    // queue?.run()
  }
}

export const globalStack = new GlobalStack()

// function last<T>(array: T[]): T | undefined {
//   return array[array.length - 1]
// }
