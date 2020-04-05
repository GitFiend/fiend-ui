import {renderInternal} from './render'
import {div, text, Tree, TreeBase} from './create-tree'

//
export class CustomComponent<P> implements TreeBase {
  type = 'custom' as const

  target?: HTMLElement

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

      if (this.target !== undefined) renderInternal(curr, prev, this.target, this.key, 0)
    }
  }
}
//

// export class MyCustomComponent extends CustomComponent<{}> {
//   render() {
//     return div(
//       {
//         id: 'div3',
//         onClick: () => {
//           console.log('onClick')
//           this.update()
//         }
//       },
//       [text('Hi from custom component!')]
//     )
//   }
// }

export class Choochoo implements JSX.ElementClass {
  render() {
    return null
  }

  context: any
  readonly props: Readonly<any> & Readonly<{children?: React.ReactNode}> = {}
  refs: {[p: string]: React.ReactInstance} = {}
  state: Readonly<unknown> = {}

  forceUpdate(callback?: () => void): void {}

  setState<K extends keyof unknown>(state: unknown, callback?: () => void): void {}
}
