import {Rec} from '../component'
import {RefObject} from '../../util/ref'

//
export function setAttributesFromProps(element: HTMLElement, props: Rec) {
  const attributes = Object.keys(props)

  for (const attr of attributes) {
    setAttribute(element, attr, props[attr], null)
  }
}

export function updateAttributes(
  element: HTMLElement,
  newProps: Rec,
  oldProps: Rec | null
) {
  if (oldProps === null) setAttributesFromProps(element, newProps)
  else {
    updateAttrInner(element, newProps, oldProps)
  }
}

function updateAttrInner(element: HTMLElement, newProps: Rec, oldProps: Rec) {
  const newKeys = Object.keys(newProps)
  const oldKeys = Object.keys(oldProps)

  for (const key of newKeys) {
    const o = oldProps[key]
    const n = newProps[key]

    if (o === undefined) {
      setAttribute(element, key, n, o)
    } //
    else if (o !== n) {
      deleteAttribute(element, key, o)
      setAttribute(element, key, n, o)
    }
  }
  for (const key of oldKeys) {
    if (newProps[key] === undefined) {
      deleteAttribute(element, key, oldProps[key])
    }
  }
}

function setAttribute(
  element: HTMLElement,
  attr: string,
  value: any,
  oldValue: any
): void {
  if (attr === 'className') {
    element.setAttribute('class', value)
  } else if (attr.startsWith('on')) {
    element.addEventListener(attr.slice(2).toLowerCase(), value)
  } else if (attr === 'style') {
    setStyles(element, value, oldValue)
  } else if (attr === 'ref') {
    ;(value as RefObject<any>).current = element
  } else {
    element.setAttribute(attr, value)
  }
}

function setStyles(
  element: HTMLElement,
  styles: CSSStyleDeclaration,
  oldStyles: CSSStyleDeclaration | null
) {
  const styleKeys = Object.keys(styles)

  if (oldStyles !== null) {
    for (const s of styleKeys) {
      const style = styles[s as any]

      if (oldStyles[s as any] !== style) {
        element.style[s as any] = styles[s as any]
      }
    }
  } else {
    for (const s of styleKeys) {
      if (__DEV__) {
        if (typeof styles[s as any] === 'number') {
          console.warn(`${s}: ${styles[s as any]}`)
        }
      }
      element.style[s as any] = styles[s as any]
    }
  }
}

function deleteAttribute(element: HTMLElement, attr: string, oldValue: unknown): void {
  if (attr.startsWith('on')) {
    element.removeEventListener(attr.slice(2).toLowerCase(), oldValue as any)
  } else if (attr === 'className') {
    element.removeAttribute('class')
  } else if (attr === 'ref') {
    ;(oldValue as RefObject<any>).current = null
  } else if (attr === 'style') {
    // const styleKeys = Object.keys(value)
    //
    // for (const s of styleKeys) {
    //   element.style[s] = value[s]
    // }
  } else {
    element.removeAttribute(attr)
  }
}
