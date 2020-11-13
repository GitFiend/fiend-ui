import {UnorderedResponder} from './responder'
import {$Component} from './$component'
import {OArray} from '../util/o-array'
import {RootComponent} from '../component-types/root-component'
import {HostComponent} from '../component-types/host/host-component'
import {applyInserts} from '../util/order'

export class RunStack {
  static computeds = new Set<UnorderedResponder>()
  static reactions = new Set<UnorderedResponder>()
  static components: $Component[] = []

  static running = false

  static insertsStack = new Set<RootComponent | HostComponent>()
  static removeStack = new Set<Element | Text>()

  // static depth = 0

  static runResponders(
    computeds: Set<UnorderedResponder>,
    reactions: Set<UnorderedResponder>,
    components: Map<string, $Component>
  ) {
    // this.depth++
    // console.log('depth: ', this.depth)

    for (const [, c] of components) {
      OArray.insert(this.components, c)
    }
    for (const o of computeds) {
      this.computeds.add(o)
    }
    for (const o of reactions) {
      this.reactions.add(o)
    }

    if (!this.running) {
      this.running = true

      while (this.computeds.size > 0 || this.reactions.size > 0) {
        while (this.computeds.size > 0) {
          const computed = this.computeds.values().next().value as UnorderedResponder
          this.computeds.delete(computed)
          computed.run()
        }
        while (this.reactions.size > 0) {
          const reaction = this.reactions.values().next().value as UnorderedResponder
          this.reactions.delete(reaction)
          reaction.run()
        }
      }

      while (this.components.length > 0) {
        const component = this.components.shift()
        component?.run()
      }

      this.runInsertions()

      this.running = false
    }
    // this.depth--
  }

  static runInsertions() {
    for (const c of this.insertsStack) {
      applyInserts(c)
    }
    this.insertsStack.clear()

    for (const e of this.removeStack) {
      e.remove()
    }
    this.removeStack.clear()
  }
}
