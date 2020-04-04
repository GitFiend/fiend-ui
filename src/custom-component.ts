import {NodeBase, Tree} from './my-react-types'
import {renderInternal} from './render'
import {div, text} from './my-react-elements'

//
export class CustomComponent<P> implements NodeBase {
  type = 'custom' as const

  target: HTMLElement | null = null

  private prev: Tree | null = null
  private curr: Tree | null = null

  constructor(public props: P, public children: Tree[], public key: string) {}

  render(): Tree | null {
    return null
  }

  renderComponent(): {curr: Tree | null; prev: Tree | null} {
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
