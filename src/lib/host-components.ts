import {Subtree, SubtreeFlat, Tree} from './component-types/base'

export type HostAttributes<T extends HTMLElement> = {
  style?: Partial<CSSStyleDeclaration>
} & Partial<Omit<T, 'style'>>

// interface HA<T extends HTMLElement> extends Partial<T> {}

type DivArgs = [(HostAttributes<HTMLDivElement> | SubtreeFlat)?, ...SubtreeFlat[]]

export function div(...args: DivArgs): Tree {
  const [a1, ...children] = args

  const len = args.length

  if (len === 0) {
    return {
      type: 'div',
      props: null,
      children: null,
    }
  }
  if (len === 1) {
    if (a1 === null) {
      return {
        type: 'div',
        props: null,
        children: null,
      }
    } else if (typeof a1 === 'string') {
      return {
        type: 'div',
        props: null,
        children: [a1],
      }
    } else {
      return {
        type: 'div',
        props: a1 as any,
        children: null,
      }
    }
  }

  return {
    type: 'div',
    props: (a1 as any) ?? null,
    children,
  }
}

// export function div3(
//   attributes?: HostAttributes<HTMLDivElement>,
//   ...children: SubtreeFlat[]
// ): Tree {
//   return {
//     type: 'div',
//     props: attributes as any,
//     children,
//   }
// }

// export function div(
//   attributes?: HostAttributes<HTMLDivElement>,
//   ...children: SubtreeFlat[]
// ): Tree {
//   return {
//     type: 'div',
//     props: attributes as any,
//     children,
//   }
// }

div(
  {
    onclick: () => {
      console.log('omg')
    },
    style: {width: '12px'},
  },
  // div('omg'),
  div()
)

class C {
  _className = ''

  set className(val: string) {
    this._className = val
  }

  $() {}
}
