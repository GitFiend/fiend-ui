import {HTMLAttributes} from 'react'
import {VNode} from './my-react-types'
import {div} from './my-react-elements'

export function render(tree: VNode, target: HTMLElement) {
  renderInternal(tree, null, target, '', 0)
}

export function renderInternal(
  tree: VNode,
  prevTree: VNode | null,
  target: HTMLElement,
  parentId: string,
  index: number
) {
  if (tree === null) return

  tree.target = target

  switch (tree.type) {
    case 'div':
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
        let prevChild: VNode | null = null

        if (prevTree !== null && prevTree.children !== undefined) {
          const c = prevTree.children[i]
          prevChild = c ? c : null
        }

        renderInternal(child, prevChild, element, id, i)
      })

      target.appendChild(element)

      break
    case 'text':
      target.appendChild(document.createTextNode(tree.text))
      break
    case 'custom':
      /*

      Get the old tree somehow and determine if it's the same or recurse into it?

       */
      const {prev, curr} = tree.renderComponent()

      renderInternal(curr, prev, target, tree.key, 0)
      break
  }
}

function setAttributesFromProps(element: HTMLElement) {}
