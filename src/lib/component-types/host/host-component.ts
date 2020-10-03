import {AnyComponent, ComponentType, ParentComponent, Subtree, Tree} from '../base'
import {removeChildren, renderTree} from '../../render'
import {setAttributesFromProps, updateAttributes} from './set-attributes'
import {StandardProps} from '../component'
import {ElementNameMap} from './host-component-types'
import {renderTextComponent} from '../text-component'

// TODO: Untested performance optimisation.
const emptyMap = new Map<string, AnyComponent>()

export class HostComponent<P extends StandardProps = {}> implements ParentComponent {
  _type = ComponentType.host as const
  element: ElementNameMap[this['tag']]
  subComponents = new Map<string, AnyComponent>()
  order: string
  key: string

  constructor(
    public tag: keyof ElementNameMap,
    public props: P,
    parentOrder: string,
    public index: number
  ) {
    this.order = parentOrder + index
    this.key = this.props.key ?? this.order

    this.element = document.createElement(tag) as ElementNameMap[this['tag']]

    setAttributesFromProps(this.element, props)

    this.subComponents = this.renderSubtrees(props.children ?? [], emptyMap, this.order)
  }

  renderSubtrees(
    children: Subtree[],
    prevChildren: Map<string, AnyComponent>,
    parentOrder: string
  ): Map<string, AnyComponent> {
    const newChildren = new Map<string, AnyComponent>()

    const len = children.length - 1

    let prevElement: Element | Text | null = null

    for (let i = len; i >= 0; i--) {
      const child = children[i]

      if (child !== null) {
        const s = this.renderSubtree(child, prevChildren, newChildren, parentOrder, i)

        switch (s._type) {
          case ComponentType.host:
          case ComponentType.text:
            const {element} = s

            this.element.insertBefore(element, prevElement)
            prevElement = element

            break
          case ComponentType.custom:
            const {elements} = s

            for (const element of elements) {
              this.element.insertBefore(element, prevElement)
              prevElement = element
            }
            break
        }
      }
    }
    removeChildren(prevChildren)
    return newChildren
  }

  renderSubtree(
    subtree: Tree | string | number,
    prevChildren: Map<string, AnyComponent>,
    newChildren: Map<string, AnyComponent>,
    parentOrder: string,
    index: number
  ): AnyComponent {
    if (typeof subtree === 'string') {
      const s = renderTextComponent(subtree, prevChildren.get(subtree) ?? null, index)
      prevChildren.delete(subtree)
      newChildren.set(subtree, s)
      return s
    }

    if (typeof subtree === 'number') {
      const text = subtree.toString()
      const s = renderTextComponent(text, prevChildren.get(text) ?? null, index)
      prevChildren.delete(text)
      newChildren.set(text, s)
      return s
    }

    const key: string = subtree.props.key ?? index.toString()
    const s = renderTree(subtree, prevChildren.get(key) ?? null, parentOrder, index)
    prevChildren.delete(key)
    newChildren.set(key, s)
    return s
  }

  remove(): void {
    this.element.remove()

    removeChildren(this.subComponents)
  }
}

// TODO: prevTree.children? parent.children? Seems there might be a bug here.
export function renderHost<P extends StandardProps = {}>(
  tag: keyof ElementNameMap,
  props: P,
  prevTree: AnyComponent | null,
  parentOrder: string,
  index: number
): HostComponent {
  if (prevTree === null) {
    return new HostComponent(tag, props, parentOrder, index)
  }

  if (prevTree._type === ComponentType.host && prevTree.tag === tag) {
    prevTree.index = index

    updateAttributes(prevTree.element, props, prevTree.props)

    prevTree.props = props
    prevTree.subComponents = prevTree.renderSubtrees(
      props.children ?? [],
      prevTree.subComponents,
      prevTree.order
    )

    return prevTree
  } else {
    // Type has changed. Remove it.
    prevTree.remove()

    return new HostComponent(tag, props, parentOrder, index)
  }
}
