//
export type Tree = HostComponent | TextComponent

export interface TreeBase {
  type: TreeType
}

export interface HostComponent extends TreeBase {
  type: TreeType.host
  tag: keyof HTMLElementTagNameMap
  props: null | Record<string, unknown>
  children: Tree[]
  target: HTMLElement | null
  id: string | null
}

export interface TextComponent extends TreeBase {
  type: TreeType.text
  text: string
}

export enum TreeType {
  text,
  host,
  custom
}

export function createTree(
  // typeOrConstructor: keyof HTMLElementTagNameMap | Function,
  typeOrConstructor: keyof HTMLElementTagNameMap,
  props: Record<string, unknown> | null,
  ...children: (Tree | string)[]
): Tree {
  // console.log(arguments, normaliseChildren(children))

  // if (typeof typeOrConstructor === 'string') {
  // console.time('normalise')
  const children2 = normaliseChildren(children)
  // console.timeEnd('normalise')

  return makeHostNode(typeOrConstructor, props, children2, null, null)
  // Host component
  // return {
  //   type: TreeType.host,
  //   tag: typeOrConstructor,
  //   props,
  //   children: children2,
  //   target: null,
  //   id: null
  // }
  // } else {
  //   // typeof type === 'function'
  //
  //   if (typeOrConstructor.prototype.render !== undefined) {
  //     // class component
  //   } else {
  //     // function component
  //   }
  // }
  //
  // return null
}

function normaliseChildren(children: (Tree | string)[] | string | undefined): Tree[] {
  if (typeof children === 'string') {
    return [makeTextNode(children)]
  } else if (children !== undefined) {
    return children.map(c => {
      if (typeof c === 'string') {
        return makeTextNode(c)
      }
      return c
    })
  }
  return []
}

function makeHostNode(
  tag: keyof HTMLElementTagNameMap,
  props: null | Record<string, unknown>,
  children: Tree[],
  target: HTMLElement | null,
  id: string | null
): HostComponent {
  return {
    type: TreeType.host,
    tag,
    props,
    children,
    target,
    id
  }
}

export function makeTextNode(text: string): TextComponent {
  return {
    type: TreeType.text,
    text: text
  }
}
