import {ParentTree, Tree, TreeBase, TreeType} from './base'

export class HostComponent implements TreeBase {
  type = TreeType.host as const
  parent: ParentTree | null = null
  element: HTMLElement | null = null

  constructor(
    public tag: keyof HTMLElementTagNameMap,
    public props: Record<string, unknown> | null,
    public children: Tree[]
  ) {}

  remove(): void {}
}

// TODO: Duplicate calls to this in some branches.
export function completeTree(tree: Tree, parent: ParentTree, element: HTMLElement) {
  tree.element = element
  tree.parent = parent
}

export function applyHostChanges(
  parent: ParentTree,
  tree: HostComponent,
  prevTree: Tree | null,
  target: HTMLElement,
  index: number
) {
  if (prevTree !== null) {
  }

  const el = document.createElement(tree.tag)

  if (tree.props) setAttributesFromProps(el, tree.props)

  target.appendChild(el)
  tree.element = el
  tree.parent = parent

  return el
}

export function setAttributesFromProps(element: HTMLElement, props: Record<string, unknown>) {
  const propNames = Object.keys(props)
  const el = element as any

  for (const prop of propNames) {
    if (prop.startsWith('on')) {
      element.addEventListener(prop.slice(2).toLowerCase(), props[prop] as any)
    } else if (prop === 'style') {
      const styles = props[prop] as any

      const styleKeys = Object.keys(styles)

      for (const s of styleKeys) {
        el.style[s] = styles[s]
      }
    } else {
      el[prop] = props[prop]
    }
  }
}
