import {Rec} from '../pure-component'
import {RefObject} from '../../util/ref'
import {ElementNamespace, StandardProps} from '../../util/element'

// This should only be called the first time or if previous props were null.
export function setAttributesFromProps(
  element: Element,
  namespace: ElementNamespace,
  props: StandardProps
): void {
  const attributes = Object.keys(props)

  for (const attr of attributes) {
    const value = props[attr]

    if (value !== undefined) {
      setAttribute(element, namespace, attr, props[attr])
    }
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
    const oldValue = oldProps[key]
    const newValue = newProps[key]

    if (newValue === undefined) continue

    if (oldValue === undefined) {
      setAttribute(element, namespace, key, newValue)
    } //
    else if (oldValue !== newValue) {
      if (key.startsWith('on')) deleteAttribute(element, key, oldValue)

      setAttribute(element, namespace, key, newValue)
    }
  }

  for (const key of oldKeys) {
    const oldValue = oldProps[key]
    const newValue = newProps[key]

    if (newValue === undefined && oldValue !== undefined) {
      deleteAttribute(element, key, oldValue)
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
