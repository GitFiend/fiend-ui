import {Rec} from '../component'
import {RefObject} from '../../util/ref'

//
export function setAttributesFromProps(element: Element, props: Rec) {
  const attributes = Object.keys(props)

  for (const attr of attributes) {
    setAttribute(element, attr, props[attr])
  }
}

export function updateAttributes(element: Element, newProps: Rec, oldProps: Rec | null) {
  if (oldProps === null) setAttributesFromProps(element, newProps)
  else {
    updateAttrInner(element, newProps, oldProps)
  }
}

// TODO: Could we remove a loop by using Array.from?
function updateAttrInner(element: Element, newProps: Rec, oldProps: Rec) {
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

// TODO: Improve types.
function setAttribute(
  element: Element,
  attr: string,
  value: any
  // oldValue: any
): void {
  // if (attr === 'ref') {
  //   ;(value as RefObject<any>).current = element
  // } else {
  //   ;(element as any)[attr] = value
  // }
  switch (attr) {
    case 'key':
    case 'children':
      break
    case 'className':
      element.setAttribute('class', value)
      break
    case 'style':
      ;(element as any)[attr] = value
      break
    case 'ref':
      ;(value as RefObject<any>).current = element
      break
    default:
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

  // if (attr === 'children') return
  // if (attr === 'className') {
  //   element.setAttribute('class', value)
  // } else if (attr.startsWith('on')) {
  //   element.addEventListener(attr.slice(2), value)
  // } else if (attr === 'style') {
  //   // setStyles(element, value, oldValue)
  //   ;(element as any)[attr] = value
  // } else if (attr === 'ref') {
  //   ;(value as RefObject<any>).current = element
  // } else if (typeof value === 'boolean') {
  //   if (value) element.setAttribute(attr, '')
  //   else element.removeAttribute(attr)
  // } else {
  //   element.setAttribute(attr, value)
  // }
}

// function setStyles(element: HTMLElement, styles: string, oldStyles: string | null) {
//   if (styles !== oldStyles) {
//     element.setAttribute('style', styles)
//   }
//   // const styleKeys = Object.keys(styles)
//   //
//   // if (oldStyles !== null) {
//   //   for (const s of styleKeys) {
//   //     const style = styles[s as any]
//   //
//   //     if (oldStyles[s as any] !== style) {
//   //       element.style[s as any] = styles[s as any]
//   //     }
//   //   }
//   // } else {
//   //   element.setAttribute(
//   //     'style',
//   //     Object.entries(styles)
//   //       .map(pair => pair.join(':'))
//   //       .join(';')
//   //   )
//   //   // for (const s of styleKeys) {
//   //   //   if (__DEV__) {
//   //   //     if (typeof styles[s as any] === 'number') {
//   //   //       console.warn(`${s}: ${styles[s as any]}`)
//   //   //     }
//   //   //   }
//   //   //   element.style[s as any] = styles[s as any]
//   //   // }
//   // }
// }

function deleteAttribute(element: Element, attr: string, oldValue: unknown): void {
  if (attr.startsWith('on')) {
    element.removeEventListener(attr.slice(2), oldValue as any)
  } else if (attr === 'className') {
    element.removeAttribute('class')
  } else if (attr === 'ref') {
    ;(oldValue as RefObject<any>).current = null
  } else {
    element.removeAttribute(attr)
  }
}
