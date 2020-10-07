import {AnyComponent, ComponentType, ParentComponent, Subtree, Tree} from '../base'
import {removeChildren, renderTree} from '../../render'
import {setAttributesFromProps, updateAttributes} from './set-attributes'
import {StandardProps} from '../component'
import {ElementNameMap} from './host-component-types'
import {renderTextComponent} from '../text-component'
import {InsertedOrder, Order} from '../../util/order'

// TODO: Untested performance optimisation.
// const emptyMap = new Map<string, AnyComponent>()

export class HostComponent<P extends StandardProps = {}> implements ParentComponent {
  _type = ComponentType.host as const
  element: ElementNameMap[this['tag']]
  order: string
  key: string

  subComponents = new Map<string, AnyComponent>()
  inserted: InsertedOrder[] = []

  constructor(
    public tag: keyof ElementNameMap,
    public props: P,
    public parent: ParentComponent,
    public index: number
  ) {
    this.order = Order.key(parent.order, index)
    this.key = this.props.key ?? this.order

    this.element = document.createElement(tag) as ElementNameMap[this['tag']]
    parent.insert(this.element, this.order)

    setAttributesFromProps(this.element, props)

    this.renderSubtrees(props.children ?? [])
  }

  // What if our sub component has lots of elements to insert?
  insert(element: Element | Text, order: string) {
    Order.insert(this.element, this.inserted, element, order)

    // const {inserted} = this
    //
    // const len = inserted.length
    //
    // for (let i = len - 1; i >= 0; i--) {
    //   const ins = inserted[i]
    //
    //   if (order === ins.order) {
    //     ins.element = element
    //
    //     const next = inserted[i + 1]
    //     if (next !== undefined) {
    //       this.element.insertBefore(element, next.element)
    //     }
    //
    //     return
    //   }
    //   if (order > ins.order) {
    //     this.inserted.splice(i, 0, {
    //       order,
    //       element,
    //     })
    //
    //     const next = inserted[i + 1]
    //     if (next !== undefined) {
    //       this.element.insertBefore(element, next.element)
    //     }
    //     return
    //   }
    // }
    //
    // inserted.push({order, element})
    // this.element.insertBefore(element, null)

    // for (const [o, e] of this.inserted) {
    //   if (order > o) {
    //     //
    //   }
    // }
    //
    // for (const [, c] of this.subComponents) {
    //   if (order < c.order && c.element !== null) {
    //     this.element.insertBefore(element, c.element)
    //     return
    //   }
    // }
    // this.element.insertBefore(element, null)
  }

  renderSubtrees(
    children: Subtree[]
    // prevChildren: Map<string, AnyComponent>
  ) {
    const prevChildren = this.subComponents
    this.subComponents = new Map<string, AnyComponent>()

    const len = children.length - 1

    // let prevElement: Element | Text | null = null

    for (let i = len; i >= 0; i--) {
      const child = children[i]

      if (child !== null) {
        this.renderSubtree(child, prevChildren, this.subComponents, this, i)

        // switch (s._type) {
        //   case ComponentType.host:
        //   case ComponentType.text:
        //     const {element} = s
        //
        //     this.element.insertBefore(element, prevElement)
        //     prevElement = element
        //
        //     break
        //   case ComponentType.custom:
        //     const {elements} = s
        //
        //     for (const element of elements) {
        //       this.element.insertBefore(element, prevElement)
        //       prevElement = element
        //     }
        //     break
        // }
      }
    }
    removeChildren(prevChildren)
    // return newChildren
  }

  renderSubtree(
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
        this,
        index
      )
      prevChildren.delete(subtree)
      newChildren.set(subtree, s)
      return s
    }

    if (typeof subtree === 'number') {
      const text = subtree.toString()
      const s = renderTextComponent(text, prevChildren.get(text) ?? null, this, index)
      prevChildren.delete(text)
      newChildren.set(text, s)
      return s
    }

    const key: string = subtree.props.key ?? index.toString()
    const s = renderTree(subtree, prevChildren.get(key) ?? null, this, index)
    prevChildren.delete(key)
    newChildren.set(key, s)
    return s
  }

  remove(): void {
    this.element.remove()
    // this.inserted

    removeChildren(this.subComponents)
  }
}

// TODO: prevTree.children? parent.children? Seems there might be a bug here.
export function renderHost<P extends StandardProps = {}>(
  tag: keyof ElementNameMap,
  props: P,
  prevTree: AnyComponent | null,
  parent: ParentComponent,
  index: number
): HostComponent {
  if (prevTree === null) {
    return new HostComponent(tag, props, parent, index)
  }

  if (prevTree._type === ComponentType.host && prevTree.tag === tag) {
    if (prevTree.index !== index) {
      prevTree.index = index
      prevTree.order = Order.key(parent.order, index)
      parent.insert(prevTree.element, prevTree.order)
    }

    updateAttributes(prevTree.element, props, prevTree.props)

    prevTree.props = props

    prevTree.renderSubtrees(props.children ?? [])

    return prevTree
  } else {
    // Type has changed. Remove it.
    prevTree.remove()

    return new HostComponent(tag, props, parent, index)
  }
}
