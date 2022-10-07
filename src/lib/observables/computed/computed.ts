import {
  addCallingResponderToOurList,
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
    const active = this.hasActiveResponders()

    if (active) {
      this.runFunction(true)
    } else if (this._ref.current !== null) {
      this.deactivateAndClear()
    }
  }

  get(responder: Responder<unknown> | null): T | unknown {
    if (responder !== null) {
      this.addCallingResponderToOurList(responder)
    }

    const previouslyDeactivated = this._ref.current === null
    const active = this.hasActiveResponders()

    if (previouslyDeactivated) {
      if (active) {
        this._ref.current = this
      }
      this.runFunction(false)
    } else {
      if (active) {
        globalStack.runComputedNowIfInActionStack(this._ref)
      } else {
        this.deactivateAndClear()
      }
    }

    return this.value
  }

  runFunction(shouldNotify: boolean) {
    globalStack.pushResponder(this)
    const value = this.f()
    globalStack.popResponder()

    if (value !== this.value) {
      this.value = value

      if (shouldNotify) {
        notify(this)
      }
    }
  }

  addCallingResponderToOurList(responder: Responder<unknown>) {
    addCallingResponderToOurList(this, responder)
  }

  hasActiveResponders(): boolean {
    return hasActiveResponders(this)
  }

  deactivateAndClear(): void {
    this._ref.current = null

    const {computeds, reactions, components} = this

    reactions.clear()
    components.clear()

    for (const c of computeds) {
      if (c.current !== null) {
        c.current.deactivateAndClear()
      }
    }
    computeds.clear()
  }

  isMarkedActive(): boolean {
    return this._ref.current !== null
  }
}
