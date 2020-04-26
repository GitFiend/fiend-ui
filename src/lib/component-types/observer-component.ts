import {equalProps, ParentTree2, Z, ComponentBase, ZType, SubTree, Tree} from './base'
import {renderInternal} from '../render'
import {autorun, IReactionDisposer} from 'mobx'

export class ObserverComponent<P extends {} = {}> implements ComponentBase {
  disposers: IReactionDisposer[] = []

  type = ZType.custom as const
  element: HTMLElement
  subtree: Z | null = null

  constructor(public props: P, public parent: ParentTree2, public children: SubTree[]) {
    this.element = parent.element
  }

  render(): Tree | null {
    return null
  }

  update() {
    const res = this.render()

    if (res !== null) this.subtree = renderInternal(this.parent, res, this.subtree, 0)
  }

  updateWithNewProps(props: P): void {
    if (!equalProps(this.props, props)) {
      this.props = props
      this.update()
    }
  }

  componentDidMount(): void {
    //
  }

  mount() {
    this.disposers.push(
      autorun(() => {
        this.update()
      })
    )
    this.componentDidMount()
  }

  remove(): void {
    this.subtree?.remove()
    this.disposers.forEach((d) => d())
  }

  // Required by JSX
  context: any
  refs: any
  state: any
  setState: any
  forceUpdate: any
}
