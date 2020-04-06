import {Tree} from './create-tree'

export function render(tree: Tree, target: HTMLElement) {
  renderInternal(tree, null, target, '', 0)
}

export function renderInternal(
  tree: Tree | null,
  prevTree: Tree | null,
  target: HTMLElement,
  parentId: string,
  index: number
) {
  if (tree === null) return

  const element = compareTree(tree, prevTree, target, index) as HTMLElement
  target.appendChild(element)

  if (typeof tree === 'string') return

  tree.target = target

  // tree can't be a string
  const {type, props, children} = tree
  const key = props?.key

  const id = `${parentId}${key !== undefined ? key : index}`

  if (props !== null) setAttributesFromProps(element, props)

  if (typeof children === 'string') {
    renderInternal(children, null, element, id, 0)
  } else {
    children?.forEach((child, i) => {
      renderInternal(child, getPrevChild(prevTree, i), element, id, i)
    })
  }
}

function getPrevChild(prevTree: Tree | null, index: number) {
  if (prevTree === null) return null
  if (typeof prevTree === 'string') return null
  if (typeof prevTree.children === 'string') {
    return prevTree.children
  }
  if (prevTree.children !== undefined) return prevTree.children[index] || null
  return null
}

// Don't worry about perf yet. Rethink naming where the work is done.
function compareTree(tree: Tree | null, prevTree: Tree | null, target: HTMLElement, index: number) {
  if (tree !== null && prevTree !== null) {
    if (index === 0) {
      target.innerHTML = ''
    } else {
      const {length} = target.childNodes

      for (let i = index; i < length; i++) {
        target.childNodes[index].remove()
      }
    }
    return createElement(tree)
  } else if (tree !== null) {
    return createElement(tree)
  }
  return null
}

function createElement(tree: Tree) {
  if (typeof tree === 'string') {
    return document.createTextNode(tree)
  }
  return document.createElement(tree.type)
}

function setAttributesFromProps(element: HTMLElement, props: Record<string, unknown>) {
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
