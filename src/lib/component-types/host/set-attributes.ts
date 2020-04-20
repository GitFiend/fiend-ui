import {Rec} from '../custom2'

//
export function setAttributesFromProps(element: HTMLElement, props: Rec) {
  const attributes = Object.keys(props)

  for (const attr of attributes) {
    setAttribute(element, attr, props[attr])
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
      setAttribute(element, key, n)
    } //
    else if (o !== n) {
      deleteAttribute(element, key, o)
      setAttribute(element, key, n)
    }
  }
  for (const key of oldKeys) {
    if (newProps[key] === undefined) {
      deleteAttribute(element, key, oldProps[key])
    }
  }
}

function setAttribute(element: any, attr: string, value: any): void {
  if (attr.startsWith('on')) {
    console.log('addEventListener', attr.slice(2).toLowerCase(), value)
    element.addEventListener(attr.slice(2).toLowerCase(), value)
  } else if (attr === 'style') {
    const styleKeys = Object.keys(value)

    for (const s of styleKeys) {
      element.style[s] = value[s]
    }
  } else {
    element[attr] = value
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
