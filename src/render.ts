import {Tree, TreeType} from './create-tree'

export function render(tree: any, target: HTMLElement) {
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

  const shouldAppend = compareTree(tree, prevTree, target, index)

  if (!shouldAppend) return

  if (tree.type === TreeType.text) {
    const element = document.createTextNode(tree.text)
    target.appendChild(element)
  } else {
    const element = document.createElement(tree.tag)
    target.appendChild(element)

    tree.target = target

    // tree can't be a string
    const {props, children} = tree
    const key = props?.key

    const id = `${parentId}${key !== undefined ? key : index}`

    if (tree.props !== null) setAttributesFromProps(element, tree.props)

    children.forEach((child, i) => {
      renderInternal(child, prevTree?.children[i] || null, element, id, i)
    })
  }
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
    return true
  } else if (tree !== null) {
    return true
  }
  return false
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
