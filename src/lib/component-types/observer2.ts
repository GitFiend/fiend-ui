import {equalProps, ParentTree2, Subtree, Tree2, TreeBase, TreeSlice2, TreeType} from './base'
import {renderInternal2} from '../render2'
import {autorun, IReactionDisposer} from 'mobx'

export class Observer2<P extends {} = {}> implements TreeBase {
  disposers: IReactionDisposer[] = []

  type = TreeType.custom as const
  element: HTMLElement
  subtree: Tree2 | null = null

  constructor(public props: P, public parent: ParentTree2, public children: Subtree[]) {
    this.element = parent.element
  }

  render(): TreeSlice2 | null {
    return null
  }

  update() {
    const res = this.render()

    if (res !== null) this.subtree = renderInternal2(this.parent, res, this.subtree, 0)
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
