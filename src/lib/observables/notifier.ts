import {globalStack} from './global-stack'
import {Responder, ResponderType, UnorderedResponder} from './responder'
import {$Component} from './$component'
import {RunStack} from './run-stack'
import {Computed} from './computed/computed'

/*
A Notifier is something with observable-like behaviour.

Could be a plain observable or a computed (Computeds are both Notifiers and Responders).

 */
export interface Notifier {
  computeds: Set<WeakRef<Computed<unknown>>>
  reactions: Set<WeakRef<UnorderedResponder>>
  components: Map<string, WeakRef<$Component>>
}

export function addCallingResponderToOurList(
  notifier: Notifier,
  responder: Responder<unknown>
): void {
  switch (responder.responderType) {
    case ResponderType.computed:
      notifier.computeds.add(new WeakRef(responder))
      break
    case ResponderType.autoRun:
    case ResponderType.reaction:
      notifier.reactions.add(new WeakRef(responder))
      break
    case ResponderType.component:
      // TODO: Improve types.
      const r = responder as $Component
      notifier.components.set(r.order, new WeakRef(r))
      break
  }
}

export function notify(notifier: Notifier): void {
  const {computeds, reactions, components} = notifier

  if (computeds.size > 0 || reactions.size > 0 || components.size > 0) {
    if (!globalStack.queueNotifierIfInAction(notifier)) {
      notifier.computeds = new Set()
      notifier.reactions = new Set()
      notifier.components = new Map()

      RunStack.runRefResponders(computeds, reactions, components)
    }
  }
}

export function hasActiveResponders({
  reactions,
  components,
  computeds,
}: Notifier): boolean {
  for (const r of reactions) {
    if (r.deref()) return true
  }
  for (const cRef of components.values()) {
    if (cRef.deref()) return true
  }
  for (const cRef of computeds) {
    const c = cRef.deref()
    if (c) {
      if (hasActiveResponders(c)) {
        return true
      }
    }
  }

  return false
}