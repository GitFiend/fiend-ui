import {HostComponent} from './host/host-component'
import {TextComponent} from './text-component'
import {Render} from '../render'
import {Order} from '../util/order'
import {AnyComponent} from './base-component'
import {FiendElement} from '../..'
import {RunStack} from '../observables/run-stack'

export class RootComponent {
  component: AnyComponent | null = null
  order = '1'
  key = 'root'

  inserted: (HostComponent | TextComponent)[] = []

  // key is an element, value is the previous element
  siblings = new WeakMap<Element | Text, Element | Text | null>()

  constructor(public element: HTMLElement) {}

  render(tree: FiendElement) {
    this.component = Render.tree(tree, this.component, this, this, 0)
    RunStack.run()
  }

  insertChild(child: HostComponent | TextComponent) {
    Order.insert(this, child)
  }

  removeChild(child: HostComponent | TextComponent) {
    Order.remove(this, child)
  }

  moveChild(child: HostComponent | TextComponent) {
    Order.move(this, child)
  }

  remove(): void {
    this.component?.remove()
    this.component = null
  }

  get html(): string {
    return this.element.innerHTML
  }
}
