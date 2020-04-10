import {HostComponent, Tree, TreeType} from './create-tree'

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
  const element = apply(tree, prevTree, target, index)

  if (typeof tree === 'string' || tree === null || element === null) return

  tree.element = element

  // TODO: Need to check for prev children to delete (prev children array longer).
  tree.children.forEach((child, i) => {
    renderInternal(child, getPrevChild(prevTree, i), element, '', i)
  })
}

function apply(
  tree: Tree | null,
  prevTree: Tree | null,
  target: HTMLElement,
  index: number
): HTMLElement | null {
  if (tree === null) {
    removeFollowingElements(target, index)
    return null
  }

  if (prevTree === null) {
    // tree not null, could be a string.
    return addElement(tree, target)
  }

  // Both tree and prevTree not null.
  if (typeof tree === 'string') {
    if (tree !== prevTree) {
      return replaceElement(tree, target, index)
    }
    return null // equal strings
  }
  if (typeof prevTree === 'string') {
    return replaceElement(tree, target, index)
  }

  if (tree.type !== prevTree.type) {
    return replaceElement(tree, target, index)
  }
  if (tree.type === TreeType.host) {
    if (tree.tag === prevTree.tag) {
      if (equalProps(tree.props, prevTree.props)) {
        return prevTree.element || null
      }
      return updateElement(tree, prevTree, target, index)
    }
  }
  return replaceElement(tree, target, index)
}

function addElement(tree: Tree, target: HTMLElement): HTMLElement | null {
  if (typeof tree === 'string') {
    target.appendChild(document.createTextNode(tree))
    return null
  } else {
    const el = document.createElement(tree.tag)

    if (tree.props) setAttributesFromProps(el, tree.props)

    target.appendChild(el)
    return el
  }
}

function replaceElement(tree: Tree, target: HTMLElement, index: number) {
  removeFollowingElements(target, index)

  return addElement(tree, target)
}

function updateElement(
  tree: Tree,
  prevTree: Tree,
  target: HTMLElement,
  index: number
): HTMLElement {
  const el = target.childNodes[index]

  if (el !== undefined) {
    // TODO
  }
  return el as HTMLElement
}

function getPrevChild(prevTree: Tree | null, index: number): string | HostComponent | null {
  if (prevTree === null) return null

  if (typeof prevTree === 'string') return null

  if (prevTree.children !== undefined) {
    return prevTree.children[index] || null
  }
  return null
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

function removeFollowingElements(target: HTMLElement, index: number): void {
  if (index === 0) {
    target.innerHTML = ''
  } else {
    const {length} = target.childNodes

    for (let i = index; i < length; i++) {
      target.childNodes[index].remove()
    }
  }
}

function equalProps(
  props: Record<string, unknown> | null,
  prevProps: Record<string, unknown> | null
) {
  // TODO
  return true
}
