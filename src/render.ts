import {HTMLAttributes} from 'react'
import {Tree} from './create-tree'

export function render(tree: Tree, target: HTMLElement) {
  renderInternal(tree, null, target, '', 0)
}

export function renderInternal(
  tree: Tree,
  prevTree: Tree | null,
  target: HTMLElement,
  parentId: string,
  index: number
) {
  if (tree === null) return

  tree.target = target

  switch (tree.type) {
    case 'custom':
      /*

      Get the old tree somehow and determine if it's the same or recurse into it?

       */
      const {prev, curr} = tree.renderComponent()

      renderInternal(curr, prev, target, tree.key, 0)
      break

    case 'text':
      target.appendChild(document.createTextNode(tree.text))
      break
    default:
      const {type, props, children, key} = tree

      const element = document.createElement(type)
      const id = `${parentId}${key !== undefined ? key : index}`

      const propNames = Object.keys(props) as (keyof HTMLAttributes<HTMLDivElement>)[]

      for (const prop of propNames) {
        if (prop.startsWith('on')) {
          element.addEventListener(prop.slice(2).toLowerCase(), props[prop])
        } else {
          ;(element as any)[prop] = props[prop]
        }
      }

      children?.forEach((child, i) => {
        let prevChild: Tree | null = null

        if (prevTree !== null && prevTree.children !== undefined) {
          const c = prevTree.children[i]
          prevChild = c ? c : null
        }

        renderInternal(child, prevChild, element, id, i)
      })

      target.appendChild(element)

      break
  }
}

function setAttributesFromProps(element: HTMLElement) {}
