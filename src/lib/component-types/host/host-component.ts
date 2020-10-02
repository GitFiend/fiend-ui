import {AnyComponent, ComponentType, ParentComponent, Subtree, Tree} from '../base'
import {removeChildren, renderSubtrees, renderTree} from '../../render'
import {setAttributesFromProps, updateAttributes} from './set-attributes'
import {StandardProps} from '../component'
import {ElementNameMap} from '../../host-component-types'
import {renderTextComponent} from '../text-component'

// TODO: Untested performance optimisation.
const emptyMap = new Map<string, AnyComponent>()

export class HostComponent<P extends StandardProps = {}> implements ParentComponent {
  _type = ComponentType.host as const
  containerElement: ElementNameMap[this['tag']]
  lastInserted = null
  subComponents = new Map<string, AnyComponent>()
  order: string
  key: string

  constructor(
    public tag: keyof ElementNameMap,
    public props: P,
    // public parent: ParentComponent,
    public index: number,
    parentOrder: string
  ) {
    this.order = parentOrder + index
    this.key = this.props.key ?? this.order

    this.containerElement = document.createElement(tag) as ElementNameMap[this['tag']]

    setAttributesFromProps(this.containerElement, props)

    // parent.containerElement.insertBefore(this.containerElement, parent.lastInserted)
    // parent.lastInserted = this.containerElement
    // }

    this.subComponents = renderSubtrees(props.children ?? [], emptyMap, this)
  }

  insert(component: AnyComponent) {
    //
    component.containerElement
  }

  renderSubtrees(
    children: Subtree[],
    prevChildren: Map<string, AnyComponent>
    // parent: HostComponent
  ): Map<string, AnyComponent> {
    const newChildren = new Map<string, AnyComponent>()

    const len = children.length - 1

    for (let i = len; i >= 0; i--) {
      const child = children[i]

      if (child !== null) {
        this.insert(this.renderSubtree(child, prevChildren, newChildren, i))
      }
    }
    removeChildren(prevChildren)
    return newChildren
  }

  renderSubtree(
    subtree: Tree | string | number,
    prevChildren: Map<string, AnyComponent>,
    newChildren: Map<string, AnyComponent>,
    // parent: ParentComponent,
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

  remove(): void {
    this.containerElement.remove()

    removeChildren(this.subComponents)
    // for (const c of this.subComponents) c.remove()
  }
}

// TODO: prevTree.children? parent.children? Seems there might be a bug here.
export function renderHost<P extends StandardProps = {}>(
  tag: keyof ElementNameMap,
  props: P,
  // parent: ParentComponent,
  prevTree: AnyComponent | null,
  index: number,
  parentOrder: string
): HostComponent {
  if (prevTree === null) {
    return new HostComponent(tag, props, index, parentOrder)
  }

  if (prevTree._type === ComponentType.host && prevTree.tag === tag) {
    // if (index !== prevTree.index) {
    // parent.containerElement.insertBefore(prevTree.containerElement, parent.lastInserted)
    // parent.lastInserted = prevTree.containerElement
    prevTree.index = index
    // }

    updateAttributes(prevTree.containerElement, props, prevTree.props)

    prevTree.props = props
    prevTree.subComponents = renderSubtrees(
      props.children ?? [],
      prevTree.subComponents,
      prevTree
    )

    return prevTree
  } else {
    // Type has changed. Remove it.
    prevTree.remove()
    // removeSubComponents(parent, index)
    return new HostComponent(tag, props, index, parentOrder)
  }
}
