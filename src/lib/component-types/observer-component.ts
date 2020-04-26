import {equalProps, ParentTree2, Z, ComponentBase, ZType, SubTree, Tree} from './base'
import {renderInternal} from '../render'
import {autorun, IReactionDisposer} from 'mobx'
import {Props} from './component'

export class ObserverComponent<P extends {} = {}> implements ComponentBase {
  disposers: IReactionDisposer[] = []

  type = ZType.custom as const
  element: HTMLElement
  subtree: Z | null = null
  props: Props<P>

  constructor(props: P, public parent: ParentTree2, public children: SubTree) {
    this.props = props
    this.props.children = children

    this.element = parent.element
  }

  render(): Tree | null {
    return null
  }

  update() {
    const res = this.render()

    if (res !== null) this.subtree = renderInternal(this.parent, res, this.subtree, 0)
  }

  updateWithNewProps(props: P, children: SubTree): void {
    const p = props as Props<P>
    p.children = children

    if (!equalProps(this.props, p)) {
      this.props = p
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
