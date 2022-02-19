import {
  addCallingResponderToOurList,
  clearNotifier,
  hasActiveResponders,
  Notifier,
  notify,
} from '../notifier'
import {globalStack} from '../global-stack'
import {Responder, ResponderType, UnorderedResponder} from '../responder'
import {$Component} from '../$component'
import {RefObject} from '../../util/ref'

export class Computed<T> implements UnorderedResponder, Notifier {
  responderType = ResponderType.computed as const
  ordered = false as const

  // Things we call when this computed updates.
  computeds = new Set<RefObject<Computed<unknown>>>()
  reactions = new Set<RefObject<UnorderedResponder>>()
  components = new Map<string, RefObject<$Component>>()

  value: T | unknown

  _ref: RefObject<this> = {
    current: null,
  }

  constructor(public f: () => T, public name: string) {}

  run(): void {
    if (this.hasActiveResponders()) {
      globalStack.pushResponder(this)
      const result = this.f()

      globalStack.popResponder()

      this.activate(this.hasActiveResponders())

      if (result !== this.value) {
        this.value = result

        notify(this)
      }
    } else {
      this.activate(false)
    }
  }

  get(responder: Responder | null): T | unknown {
    if (this._ref.current === null) {
      globalStack.pushResponder(this)
      this.value = this.f()

      globalStack.popResponder()
    } else {
      globalStack.runComputedNowIfInActionStack(this._ref)
    }

    if (responder !== null) {
      // This shouldn't be added unless it is properly active.
      // TODO: Write a test where responder is added even though the calling computed
      // isn't active?
      this.addCallingResponderToOurList(responder)
    }

    // TODO: Why? Is this because the responder hasn't finished becoming active yet?
    this.activate(responder !== null || this.hasActiveResponders())

    return this.value
  }

  activate(shouldActivate: boolean) {
    if (shouldActivate) {
      if (this._ref.current === null) {
        this._ref.current = this
      }
    } else {
      if (this._ref.current !== null) {
        this._ref.current = null

        this.clearNotifyList()
      }
    }
  }

  addCallingResponderToOurList(responder: Responder) {
    addCallingResponderToOurList(this, responder)
  }

  hasActiveResponders(): boolean {
    return hasActiveResponders(this)
  }

  clearNotifyList(): void {
    clearNotifier(this)
  }
}
