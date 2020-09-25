import {RefObject} from './util/ref'
import {Subtree, Tree} from './component-types/base'

type DataPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]
type OptionalDataPropertiesOnly<T> = {
  [P in DataPropertyNames<T>]?: T[P]
}
export type ElementNameMap = SVGElementTagNameMap & HTMLElementTagNameMap
export type HostAttributes<N extends keyof HTMLElementTagNameMap> = Omit<
  OptionalDataPropertiesOnly<HTMLElementTagNameMap[N]>,
  'style' | 'children'
> & {
  key?: string
  style?: string
  ref?: RefObject<HTMLElementTagNameMap[N]>
  ariaLabel?: string
  ariaSelected?: boolean
  ariaModal?: boolean
  role?: 'tab'
  children?: Subtree[]
}
export type SvgElementAttributes<N extends keyof SVGElementTagNameMap> = Omit<
  OptionalDataPropertiesOnly<SVGElementTagNameMap[N]>,
  'style' | 'children'
> & {
  key?: string
  style?: string
  ref?: RefObject<SVGElementTagNameMap[N]>
  children?: Subtree[]
}

export function makeHtmlElementConstructor<N extends keyof HTMLElementTagNameMap>(
  tagName: N
): (props: HostAttributes<N> | string) => Tree {
  return props => {
    if (typeof props === 'string')
      return {
        _type: tagName,
        props: {
          children: [props],
        },
      }

    return {
      _type: tagName,
      props,
    }
  }
}

export function makeSvgElementConstructor<N extends keyof SVGElementTagNameMap>(
  tagName: N
): (props: SvgElementAttributes<N>) => Tree {
  return props => {
    return {
      _type: tagName,
      props,
    }

    // const [a1, ...children] = args
    //
    // if (args.length === 0) {
    //   return {
    //     _type: tagName,
    //     props: null,
    //     children: [],
    //   }
    // } else {
    //   if (isPropsObject(a1)) {
    //     return {
    //       _type: tagName,
    //       props: a1 as any,
    //       children: children as Subtree[],
    //     }
    //   } else {
    //     return {
    //       _type: tagName,
    //       props: null,
    //       children: args as any[],
    //     }
    //   }
    // }
  }
}

export type SvgAttributes = Omit<SvgElementAttributes<'svg'>, 'width' | 'height'> & {
  width?: number
  height?: number
}
export type PolyLineAttributes = Omit<SvgElementAttributes<'polyline'>, 'points'> & {
  points?: string
}
