import {UnorderedResponder} from './responder'
import {$Component} from './$component'
import {OArray} from '../util/o-array'
import {RootComponent} from '../component-types/root-component'
import {HostComponent} from '../component-types/host/host-component'
import {applyInserts} from '../util/order'
import {PureComponent} from '../..'
import {time, timeEnd} from '../util/measure'

export class RunStack {
  static computeds = new Set<UnorderedResponder>()
  static reactions = new Set<UnorderedResponder>()
  static components: $Component[] = []

  private static running = false

  static insertsStack = new Set<RootComponent | HostComponent>()
  static removeStack = new Set<Element | Text>()

  static componentDidMountStack: PureComponent[] = []
  static componentDidUpdateStack: PureComponent[] = []

  static runResponders(
    computeds: Set<UnorderedResponder>,
    reactions: Set<UnorderedResponder>,
    components: Map<string, $Component>
  ) {
    for (const c of components.values()) {
      OArray.insert(this.components, c)
    }
    for (const c of computeds) {
      this.computeds.add(c)
    }
    for (const r of reactions) {
      this.reactions.add(r)
    }

    this.run()
  }

  static runRefResponders(
    computeds: Set<WeakRef<UnorderedResponder>>,
    reactions: Set<WeakRef<UnorderedResponder>>,
    components: Map<string, WeakRef<$Component>>
  ) {
    for (const cRef of components.values()) {
      const c = cRef.deref()
      if (c) OArray.insert(this.components, c)
    }
    for (const cRef of computeds) {
      const c = cRef.deref()
      if (c) this.computeds.add(c)
    }
    for (const rRef of reactions) {
      const r = rRef.deref()
      if (r) this.reactions.add(r)
    }

    this.run()
  }

  static run() {
    if (!this.running) {
      this.running = true

      time('😈Reactions')
      while (this.computeds.size > 0 || this.reactions.size > 0) {
        while (this.computeds.size > 0) {
          const computed: UnorderedResponder = this.computeds.values().next().value
          this.computeds.delete(computed)
          computed.run()
        }
        while (this.reactions.size > 0) {
          const reaction: UnorderedResponder = this.reactions.values().next().value
          this.reactions.delete(reaction)
          reaction.run()
        }
      }
      timeEnd('😈Reactions')

      time('😈Render')
      while (this.components.length > 0) {
        const component = this.components.shift()
        component?.run()
      }
      timeEnd('😈Render')

      time('😈DOM')
      for (const e of this.removeStack) e.remove()
      this.removeStack.clear()
      for (const c of this.insertsStack) applyInserts(c)
      this.insertsStack.clear()
      timeEnd('😈DOM')

      time('😈Mount/Update')
      while (this.componentDidMountStack.length > 0) {
        const ref = this.componentDidMountStack.shift()
        ref?.componentDidMount()
      }
      while (this.componentDidUpdateStack.length > 0) {
        const ref = this.componentDidUpdateStack.shift()
        ref?.componentDidUpdate()
      }
      timeEnd('😈Mount/Update')

      this.running = false

      if (!this.empty()) this.run()

      // if (__DEV__) {
      //   console.log(
      //     this.computeds.size,
      //     this.reactions.size,
      //     this.components.length,
      //     this.insertsStack.size,
      //     this.removeStack.size,
      //     this.componentDidMountStack.length,
      //     this.componentDidUpdateStack.length
      //   )
      // }
    }
  }

  static empty(): boolean {
    return (
      this.computeds.size === 0 &&
      this.reactions.size === 0 &&
      this.components.length === 0 &&
      this.insertsStack.size === 0 &&
      this.removeStack.size === 0 &&
      this.componentDidMountStack.length === 0 &&
      this.componentDidUpdateStack.length === 0
    )
  }
}
