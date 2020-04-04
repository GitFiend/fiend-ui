import {NodeBase, VNode} from './my-react-types'
import {renderInternal} from './render'
import {div, text} from './my-react-elements'

//
export class CustomComponent<P> implements NodeBase {
  type = 'custom' as const

  target: HTMLElement | null = null

  private prev: VNode | null = null
  private curr: VNode | null = null

  constructor(public props: P, public children: VNode[], public key: string) {}

  render(): VNode | null {
    return null
  }

  renderComponent(): {curr: VNode | null; prev: VNode | null} {
    this.prev = this.curr
    this.curr = this.render()

    return {
      prev: this.prev,
      curr: this.curr
    }
  }

  update() {
    if (this.target !== null) {
      const {curr, prev} = this.renderComponent()

      renderInternal(curr, prev, this.target, this.key, 0)
    }
  }
}
//

export class MyCustomComponent extends CustomComponent<{}> {
  render() {
    return div(
      {
        id: 'div3',
        onClick: () => {
          console.log('onClick')
          this.update()
        }
      },
      [text('Hi from custom component!')]
    )
  }
}
