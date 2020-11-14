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

  private static running = false
  private static count = 0

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
      if (!c._removed) OArray.insert(this.components, c)
    }
    for (const o of computeds) {
      // if (o.active)
      this.computeds.add(o)
    }
    for (const o of reactions) {
      if (o.active) this.reactions.add(o)
    }

    if (!this.running) {
      this.running = true
      this.count = 0

      console.log(this.computeds.size, this.reactions.size, this.components.length)

      while (this.computeds.size > 0 || this.reactions.size > 0) {
        while (this.computeds.size > 0) {
          this.count++
          const computed = this.computeds.values().next().value as UnorderedResponder
          this.computeds.delete(computed)
          // if (computed.active) {
          //   console.log('NOT ACTIVE WTF!!!')
          // }
          computed.run()
        }
        while (this.reactions.size > 0) {
          this.count++
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
      // console.log(this.count)
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
