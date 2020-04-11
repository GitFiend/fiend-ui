import {renderInternal} from './render'
import {Tree, TreeBase, TreeType} from './create-tree'
import {autorun, IReactionDisposer, reaction} from 'mobx'

export type Component = typeof ZComponent | typeof OComponent

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

export class OComponent<P> extends ZComponent<P> {
  disposers: IReactionDisposer[] = []
  customType = CustomComponentType.mobx as const

  setupObserving() {
    console.log('setup observing. target: ', this.target)

    this.disposers.push(
      autorun(() => {
        console.log('autorun')

        this.forceUpdate()
      })
    )
  }

  // TODO
  componentWillUnmount() {
    this.disposers.forEach(d => d())
  }
}
