import {Component} from './component'
import {time, timeEnd} from '../util/measure'
import {AnyComponent, ComponentType, ParentComponent, Subtree, Tree} from './base'
import {renderTextComponent} from './text-component'
import {removeChildren, renderTree} from '../render'

// TODO: Maybe this shouldn't extend Component.
class Fragment extends Component {
  subComponents = new Map<string, AnyComponent>()

  update = () => {
    if (__DEV__) {
      time(this.constructor.name)
    }

    this.subComponents = renderSubtrees(
      this.props.children ?? [],
      this.subComponents,
      this.parent
    )

    if (__DEV__) {
      timeEnd(this.constructor.name)
    }
  }

  get element(): Element | Text | null {
    return this.elements[0] ?? null
  }

  // TODO: Is this returning elements in the correct order?
  get elements(): (Element | Text)[] {
    const elements: (Element | Text)[] = []

    for (const [, c] of this.subComponents) {
      switch (c._type) {
        case ComponentType.host:
        case ComponentType.text:
          elements.push(c.element)
          break
        case ComponentType.custom:
          elements.push(...c.elements)
          break
      }
    }

    return elements
  }

  remove() {
    super.remove()

    this.subComponents.forEach(c => c.remove())
  }
}

function renderSubtrees(
  children: Subtree[],
  prevChildren: Map<string, AnyComponent>,
  parent: ParentComponent
): Map<string, AnyComponent> {
  const newChildren = new Map<string, AnyComponent>()

  const len = children.length - 1

  for (let i = len; i >= 0; i--) {
    const child = children[i]

    if (child !== null) {
      renderSubtree(child, prevChildren, newChildren, parent, i)
    }
  }

  removeChildren(prevChildren)

  return newChildren
}

// Mutates prevChildren and newChildren
function renderSubtree(
  subtree: Tree | string | number,
  prevChildren: Map<string, AnyComponent>,
  newChildren: Map<string, AnyComponent>,
  parent: ParentComponent,
  index: number
): AnyComponent {
  if (typeof subtree === 'string') {
    const s = renderTextComponent(
      subtree,
      prevChildren.get(subtree) ?? null,
      parent,
      index
    )
    prevChildren.delete(subtree)
    newChildren.set(subtree, s)
    return s
  }

  if (typeof subtree === 'number') {
    const text = subtree.toString()
    const s = renderTextComponent(text, prevChildren.get(text) ?? null, parent, index)
    prevChildren.delete(text)
    newChildren.set(text, s)
    return s
  }

  const key: string = subtree.props.key ?? index.toString()
  const s = renderTree(subtree, prevChildren.get(key) ?? null, parent, index)
  prevChildren.delete(key)
  newChildren.set(key, s)
  return s
}

export const $F = (...args: Subtree[]): Tree => ({
  _type: Fragment as any,
  props: {children: args},
})
