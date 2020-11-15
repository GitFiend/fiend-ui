import {globalStack} from './global-stack'
import {ResponderType, UnorderedResponder} from './responder'
import {$Component} from './$component'
import {RunStack} from './run-stack'
import {RefObject} from '../util/ref'

/*
A Notifier is something with observable-like behaviour.

Could be a plain observable or a computed (Computeds are both Notifiers and Responders).

 */
export interface Notifier {
  computeds: Set<RefObject<UnorderedResponder>>
  reactions: Set<RefObject<UnorderedResponder>>
  components: Map<string, RefObject<$Component>>
}

export function addCallingResponderToOurList(notifier: Notifier) {
  const responder = globalStack.getCurrentResponder()

  if (responder !== null) {
    switch (responder.responderType) {
      case ResponderType.computed:
        notifier.computeds.add(responder._ref)
        // ;(responder as Computed<unknown>).notifiers.add(notifier._ref)
        break
      case ResponderType.autoRun:
      case ResponderType.reaction:
        notifier.reactions.add(responder._ref)
        break
      case ResponderType.component:
        // TODO: Improve types.
        const r = responder as $Component
        notifier.components.set(r.order, r._ref)
        break
    }
  }
}

export function notify(notifier: Notifier): void {
  const {computeds, reactions, components} = notifier

  if (computeds.size > 0 || reactions.size > 0 || components.size > 0) {
    if (!globalStack.queueNotifierIfInAction(notifier)) {
      notifier.computeds = new Set()
      notifier.reactions = new Set()
      notifier.components = new Map()

      RunStack.runResponders(computeds, reactions, components)
    }
  }
}

export function clearNotifier(notifier: Notifier) {
  const {computeds, reactions, components} = notifier

  computeds.clear()
  reactions.clear()
  components.clear()
}
