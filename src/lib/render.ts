import {ParentTree2, RootNode, SubSlice, Z, JSXSlice, ZType} from './component-types/base'
import {renderHost} from './component-types/host/host-component'
import {renderTextComponent} from './component-types/text-component'
import {renderCustom} from './component-types/component'

export function render(slice: JSXSlice, target: HTMLElement): void {
  const root = new RootNode(target)

  renderInternal(root, slice, null, 0)
}

export function renderInternal(
  parent: ParentTree2,
  slice: JSXSlice,
  prevTree: Z | null,
  index: number
): Z {
  const [typeOrConstructor, props, ...children] = slice

  if (typeof typeOrConstructor === 'string') {
    return renderHost(typeOrConstructor, props, children, parent, prevTree, index)
  } else {
    return renderCustom(typeOrConstructor, props, children, parent, prevTree, index)
  }
}

export function renderChildInternal(
  subtree: SubSlice,
  prevTree: Z | null,
  parent: ParentTree2,
  index: number
): Z {
  if (typeof subtree === 'string') {
    return renderTextComponent(subtree, prevTree, parent, index)
  } else if (typeof subtree === 'number') {
    return renderTextComponent(subtree.toString(), prevTree, parent, index)
  }
  // else if (Array.isArray(subtree)) {
  //   return []
  // }
  else {
    // debugger
    return renderInternal(parent, subtree, prevTree, index)
  }
}

export function removeSubtrees(parent: ParentTree2, index: number): void {
  switch (parent.type) {
    case ZType.host:
      const siblings = parent.children
      const len = siblings.length

      for (let i = index; i < len; i++) {
        siblings[i].remove()
      }
      break
    case ZType.custom:
      // Custom components one have child?
      // if (index === 0)
      //   parent.subtree?.remove()

      break
  }
}
