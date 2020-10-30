import {HostComponent} from './host/host-component'
import {TextComponent} from './text-component'
import {Render} from '../render'
import {Order} from '../util/order'
import {AnyComponent} from './base-component'
import {FiendElement} from '../..'

export class RootComponent {
  component: AnyComponent | null = null
  order = '1'
  key = 'root'

  inserted: (HostComponent | TextComponent)[] = []

  constructor(public element: HTMLElement) {}

  render(tree: FiendElement) {
    this.component = Render.tree(tree, this.component, this, this, 0)
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
