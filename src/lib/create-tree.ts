import {Tree, TreeType} from './component-types/host'
import {ZComponent} from './component-types/custom'

export function createTree(
  typeOrConstructor: keyof HTMLElementTagNameMap | typeof ZComponent,
  props: Record<string, unknown> | null,
  ...children: Tree[]
): Tree {
  // console.log(arguments)

  if (typeof typeOrConstructor === 'string') {
    return {
      type: TreeType.host,
      tag: typeOrConstructor,
      props,
      children
    }
  } else {
    console.time('construct')
    const c = new typeOrConstructor(props, children)
    console.timeEnd('construct')
    return c
  }
}
