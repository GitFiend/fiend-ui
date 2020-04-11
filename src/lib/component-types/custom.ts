import {Tree, TreeBase, TreeType} from './host'
import {renderInternal} from '../render'

export enum CustomComponentType {
  standard,
  mobx,
  pure
}

export class ZComponent<P> implements TreeBase {
  type = TreeType.custom as const
  customType: CustomComponentType = CustomComponentType.standard

  target?: HTMLElement
  element?: HTMLElement

  private prev: Tree | null = null
  private curr: Tree | null = null

  constructor(
    public props: P,
    public children: Tree[] // public key: string
  ) {}

  render(): Tree | null {
    return null
  }

  renderTree(): {curr: Tree | null; prev: Tree | null} {
    this.prev = this.curr
    this.curr = this.render()

    return {
      prev: this.prev,
      curr: this.curr
    }
  }

  forceUpdate(): void {
    if (this.target !== undefined) {
      // console.log('forceUpdate')
      const {curr, prev} = this.renderTree()

      renderInternal(curr, prev, this.target, '', 0)
    }
  }

  // didMount() {}

  // Required by JSX.ElementClass for now. Can we override this type?
  context: any
  refs = {}
  state = {}

  setState(state: unknown, callback?: () => void): void {}
}
