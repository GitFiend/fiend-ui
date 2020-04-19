import {ParentTree2, Tree2, TreeBase, TreeSlice2, TreeType} from './base'
import {renderInternal2} from '../render2'

export class Custom2<P = {}, E = {}> implements TreeBase {
  type = TreeType.custom as const
  element: HTMLElement
  subtree: Tree2 | null = null

  constructor(
    public props: P,
    public parent: ParentTree2,
    public children: (TreeSlice2 | string | number)[]
  ) {
    this.element = parent.element

    // this.update()
  }

  render(): TreeSlice2 | null {
    return null
  }

  remove(): void {
    this.subtree?.remove()
  }

  update() {
    const res = this.render()

    if (res !== null) this.subtree = renderInternal2(this.parent, res, null, 0)
  }

  /*
  TODO: Think about how to batch actions

  Could we complain if a force update happened without an action?
   */
  action(callback: () => void): void {
    callback()
    this.update()
  }

  // Required by JSX
  private context: any
  private refs: any
  private state: any
  private setState: any
  private forceUpdate: any
}

export function makeCustomComponent<P>(
  cons: typeof Custom2,
  props: P,
  parent: ParentTree2,
  children: (TreeSlice2 | string | number)[]
) {
  const component = new cons<P>(props, parent, children)
  component.update()
  return component
}
