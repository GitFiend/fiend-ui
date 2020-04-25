import {Rec} from '../custom2'
import {RefObject} from '../../util/ref'

//
export function setAttributesFromProps(element: HTMLElement, props: Rec) {
  const attributes = Object.keys(props)

  for (const attr of attributes) {
    setAttribute(element, attr, props[attr], null)
  }
}

export function updateAttributes(element: HTMLElement, newProps: Rec, oldProps: Rec | null) {
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

function setAttribute(element: HTMLElement, attr: string, value: any, oldValue: any): void {
  if (attr.startsWith('on')) {
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
  oldStyles: CSSStyleDeclaration | undefined
) {
  const styleKeys = Object.keys(styles)

  if (oldStyles) {
    for (const s of styleKeys) {
      const style = styles[s as any]

      if (oldStyles[s as any] !== style) {
        element.style[s as any] = styles[s as any]
      }
    }
  } else {
    for (const s of styleKeys) {
      element.style[s as any] = styles[s as any]
    }
  }
}

function deleteAttribute(element: HTMLElement, attr: string, oldValue: unknown): void {
  if (attr.startsWith('on')) {
    console.log('removeEventListener', attr.slice(2).toLowerCase(), oldValue)
    element.removeEventListener(attr.slice(2).toLowerCase(), oldValue as any)
    // element.addEventListener(attr.slice(2).toLowerCase(), value)
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
