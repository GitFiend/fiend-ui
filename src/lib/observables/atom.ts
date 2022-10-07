import {Responder, UnorderedResponder} from './responder'
import {
  addCallingResponderToOurList,
  hasActiveResponders,
  Notifier,
  notify,
} from './notifier'
import {$Component} from './$component'
import {Computed} from './computed/computed'

export class Atom<T> implements Notifier {
  computeds = new Set<WeakRef<Computed<unknown>>>()
  reactions = new Set<WeakRef<UnorderedResponder>>()
  components = new Map<string, WeakRef<$Component>>()

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

    for (const cRef of computeds) {
      const c = cRef.deref()

      if (c) {
        c.deactivateAndClear()
      }
    }
    computeds.clear()
  }

  addCallingResponderToOurList(responder: Responder<unknown>): void {
    addCallingResponderToOurList(this, responder)
  }
}
