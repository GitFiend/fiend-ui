import {DomComponent} from './host/dom-component'
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

  inserted: (DomComponent | TextComponent)[] = []

  // key is an element, value is the previous element
  siblings = new WeakMap<Element | Text, Element | Text | null>()

  constructor(public element: HTMLElement) {}

  render(tree: FiendElement) {
    this.component = Render.component(tree, this.component, this, this, 0)
    RunStack.run()
  }

  insertChild(child: DomComponent | TextComponent) {
    Order.insert(this, child)
  }

  removeChild(child: DomComponent | TextComponent) {
    Order.remove(this, child)
  }

  moveChild(child: DomComponent | TextComponent) {
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
