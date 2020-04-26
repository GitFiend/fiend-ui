import {equalProps, ParentTree2, SubSlice, Tree2, ComponentBase, JSXSlice, TreeType} from './base'
import {renderInternal} from '../render'
import {autorun, IReactionDisposer} from 'mobx'

export class ObserverComponent<P extends {} = {}> implements ComponentBase {
  disposers: IReactionDisposer[] = []

  type = TreeType.custom as const
  element: HTMLElement
  subtree: Tree2 | null = null

  constructor(public props: P, public parent: ParentTree2, public children: SubSlice[]) {
    this.element = parent.element
  }

  render(): JSXSlice | null {
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
