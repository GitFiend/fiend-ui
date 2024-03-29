import {Responder, UnorderedResponder} from './responder'
import {
  addCallingResponderToOurList,
  hasActiveResponders,
  Notifier,
  notify,
} from './notifier'
import {$Component} from './$component'
import {RefObject} from '../util/ref'
import {Computed} from './computed/computed'

export class Atom<T> implements Notifier {
  computeds = new Set<RefObject<Computed<unknown>>>()
  reactions = new Set<RefObject<UnorderedResponder>>()
  components = new Map<string, RefObject<$Component>>()

  constructor(public value: T, public name: string) {}

  get(responder: Responder<unknown> | null): T {
    if (responder !== null) {
      this.addCallingResponderToOurList(responder)
    }

    return this.value
  }

  set(value: T) {
    if (this.value !== value) {
      this.value = value

      if (this.hasActiveResponders()) {
        notify(this)
      } else {
        this.deactivateAndClear()
      }
    }
  }

  hasActiveResponders(): boolean {
    return hasActiveResponders(this)
  }

  deactivateAndClear(): void {
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

  addCallingResponderToOurList(responder: Responder<unknown>): void {
    addCallingResponderToOurList(this, responder)
  }
}
