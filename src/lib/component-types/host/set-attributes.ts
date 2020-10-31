import {Rec} from '../pure-component'
import {RefObject} from '../../util/ref'
import {ElementNamespace} from '../../util/element'

export function setAttributesFromProps(
  element: Element,
  namespace: ElementNamespace,
  props: Rec
): void {
  const attributes = Object.keys(props)

  for (const attr of attributes) {
    setAttribute(element, namespace, attr, props[attr])
  }
}

export function updateAttributes(
  element: Element,
  namespace: ElementNamespace,
  newProps: Rec,
  oldProps: Rec | null
): void {
  if (oldProps === null) {
    setAttributesFromProps(element, namespace, newProps)
  } else {
    updateAttrInner(element, namespace, newProps, oldProps)
  }
}

// TODO: Could we remove a loop by using Array.from?
function updateAttrInner(
  element: Element,
  namespace: ElementNamespace,
  newProps: Rec,
  oldProps: Rec
): void {
  const newKeys = Object.keys(newProps)
  const oldKeys = Object.keys(oldProps)

  for (const key of newKeys) {
    const o = oldProps[key]
    const n = newProps[key]

    if (o === undefined && n !== undefined) {
      setAttribute(element, namespace, key, n)
    } //
    else if (o !== n) {
      if (key.startsWith('on')) deleteAttribute(element, key, o)

      setAttribute(element, namespace, key, n)
    }
  }

  for (const key of oldKeys) {
    if (newProps[key] === undefined) {
      deleteAttribute(element, key, oldProps[key])
    }
  }
}

// TODO: Improve types.
function setAttribute(
  element: Element,
  namespace: ElementNamespace,
  attr: string,
  value: any
): void {
  switch (attr) {
    case 'key':
    // element.setAttribute('key', value)
    // break
    case 'children':
      break
    case 'className':
      element.setAttribute('class', value)
      break
    case 'value':
    case 'style':
      ;(element as any)[attr] = value
      break
    case 'ref':
      ;(value as RefObject<unknown>).current = element
      break
    default:
      if (namespace === ElementNamespace.svg && setSvgAttribute(element, attr, value))
        break

      if (attr.startsWith('on')) {
        element.addEventListener(attr.slice(2), value)
      } else if (typeof value === 'boolean') {
        if (value) element.setAttribute(attr, '')
        else element.removeAttribute(attr)
      } else {
        element.setAttribute(attr, value)
      }
      break
  }
}

function setSvgAttribute(element: Element, attr: string, value: any) {
  switch (attr) {
    case 'strokeWidth':
      element.setAttribute('stroke-width', value)
      return true
    case 'strokeLinejoin':
      element.setAttribute('stroke-linejoin', value)
      return true
  }

  return false
}

function deleteAttribute(element: Element, attr: string, oldValue: unknown): void {
  if (attr.startsWith('on')) {
    element.removeEventListener(attr.slice(2), oldValue as any)
  } else if (attr === 'className') {
    element.removeAttribute('class')
  } else if (attr === 'ref') {
    ;(oldValue as RefObject<unknown>).current = null
  } else {
    element.removeAttribute(attr)
  }
}
