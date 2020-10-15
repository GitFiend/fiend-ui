import {Subtree, Tree} from './component-types/base'
import {PureComponent} from './component-types/pure-component'

declare global {
  namespace JSX {
    // @ts-ignore
    type Element = any

    // @ts-ignore
    interface ElementClass extends PureComponent<any> {}
  }
}

export function createElement(
  type: keyof HTMLElementTagNameMap | typeof PureComponent,
  props: Record<string, unknown> | null,
  ...children: Subtree[]
): Tree {
  return {
    _type: type,
    props,
    children,
    // children: (children.length === 1 ? children[0] : children) as Subtree,
  }
}
