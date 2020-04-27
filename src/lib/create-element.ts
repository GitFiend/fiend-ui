import {Subtree, Tree} from './component-types/base'
import {Component} from './component-types/component'

declare global {
  namespace JSX {
    // @ts-ignore
    type Element = Subtree

    // @ts-ignore
    interface ElementClass extends Component<any> {}
  }
}

export function createElement(
  type: keyof HTMLElementTagNameMap | typeof Component,
  props: Record<string, unknown> | null,
  ...children: Subtree[]
): Tree {
  return {
    type,
    props,
    children: (children.length === 1 ? children[0] : children) as Subtree,
  }
}
