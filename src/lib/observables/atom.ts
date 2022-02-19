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

    // TODO: Need/possible to clean up here?

    // console.log(
    //   {hasContext},
    //   this.name,
    //   this.computeds.size + this.components.size + this.reactions.size
    // )

    return this.value
  }

  set(value: T) {
    if (this.value !== value) {
      this.value = value

      notify(this)
    }
  }

  hasActiveResponders(): boolean {
    return hasActiveResponders(this)
  }

  addCallingResponderToOurList(responder: Responder<unknown>): void {
    addCallingResponderToOurList(this, responder)
  }
}
