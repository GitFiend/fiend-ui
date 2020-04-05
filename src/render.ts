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

  tree.target = target

  switch (tree.type) {
    // case 'custom':
    //   /*
    //
    //   Get the old tree somehow and determine if it's the same or recurse into it?
    //
    //    */
    //   const {prev, curr} = tree.renderComponent()
    //
    //   renderInternal(curr, prev, target, tree.key, 0)
    //   break
    //
    // case 'text':
    //   target.appendChild(document.createTextNode(tree.text))
    //   break
    default:
      const {type, props, children} = tree
      const key = props?.key

      // let el: HTMLElementTagNameMap[typeof type]

      // if ()
      compareTree(tree, prevTree, target, index)

      const element = compareTree(tree, prevTree, target, index)

      if (element === null) return

      const id = `${parentId}${key !== undefined ? key : index}`

      if (props !== null) setAttributesFromProps(element, props)

      /*
      children is either a single string or an array of trees.

      handle case where there are now no child/children

      Handle string case

      of

      Loop over children and recurse.

       */

      if (typeof children === 'string') {
        if (prevTree !== null && typeof prevTree.children !== 'string') {
        }
      } else {
        children?.forEach((child, i) => {
          let prevChild: Tree | string | null = null

          if (prevTree !== null && prevTree.children !== undefined) {
            if (typeof prevTree.children === 'string') {
            } else {
              const c = prevTree.children[i]
              prevChild = c !== undefined ? c : null
            }
          }

          renderInternal(child, prevChild, element, id, i)
        })
      }

      target?.appendChild(element)

      break
  }
}

// Don't worry about perf yet. Rethink naming where the work is done.
function compareTree<T>(
  tree: Tree | null,
  prevTree: Tree | null,
  target: HTMLElement,
  index: number
) {
  if (tree !== null && prevTree !== null) {
    if (index === 0) {
      target.innerHTML = ''
    } else {
      const {length} = target.childNodes

      for (let i = index; i < length; i++) {
        target.childNodes[index].remove()
      }
    }
    return document.createElement(tree.type)
  } else if (tree !== null) {
    return document.createElement(tree.type)
  }
  return null
}

function compareChildren(
  curr: Tree | string | undefined,
  prev: Tree | string | undefined,
  element: HTMLElement
) {
  if (curr !== undefined && prev !== undefined) {
    //
    if (typeof curr === 'string' && typeof prev === 'string') {
      if (curr !== prev) {
      }
    }
  } else if (curr !== undefined) {
    //
  } else if (prev !== undefined) {
    //
  }
}

function setAttributesFromProps(element: HTMLElement, props: Record<string, unknown>) {
  const propNames = Object.keys(props)

  for (const prop of propNames) {
    if (prop.startsWith('on')) {
      element.addEventListener(prop.slice(2).toLowerCase(), props[prop] as any)
    } else {
      ;(element as any)[prop] = props[prop]
    }
  }
}
