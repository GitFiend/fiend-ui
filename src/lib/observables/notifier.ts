import {globalStack} from './global-stack'
import {Responder, ResponderType, UnorderedResponder} from './responder'
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

export function addCallingResponderToOurList(
  notifier: Notifier,
  responder: Responder
): boolean {
  // const responder = globalStack.getCurrentResponder()

  // if (responder !== null) {
  switch (responder.responderType) {
    case ResponderType.computed:
      notifier.computeds.add(responder._ref)
      return true
    case ResponderType.autoRun:
    case ResponderType.reaction:
      notifier.reactions.add(responder._ref)
      return true
    case ResponderType.component:
      // TODO: Improve types.
      const r = responder as $Component
      notifier.components.set(r.order, r._ref)
      return true
  }
  // }
  return false
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

export function clearNotifier({computeds, reactions, components}: Notifier): void {
  computeds.clear()
  reactions.clear()
  components.clear()
}

export function hasActiveResponders({
  reactions,
  components,
  computeds,
}: Notifier): boolean {
  for (const r of reactions) if (r.current !== null) return true
  for (const c of components.values()) if (c.current !== null) return true
  for (const r of computeds) if (r.current !== null) return true

  return false
}
