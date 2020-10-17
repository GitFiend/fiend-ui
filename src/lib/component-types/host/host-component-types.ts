import {RefObject} from '../../util/ref'
import {FiendNode, FiendElement} from '../../..'

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
  ariaLabelledby?: string
  ariaDescribedby?: string
  ariaModal?: boolean
  role?: 'tab' | 'dialog'
  children?: FiendNode[]
}

export type SvgElementAttributes<N extends keyof SVGElementTagNameMap> = Omit<
  OptionalDataPropertiesOnly<SVGElementTagNameMap[N]>,
  'style' | 'children'
> & {
  key?: string
  style?: string
  ref?: RefObject<SVGElementTagNameMap[N]>
  children?: FiendNode[]
}

export function makeHtmlElementConstructor<N extends keyof HTMLElementTagNameMap>(
  tagName: N
): (props?: HostAttributes<N> | string) => FiendElement {
  return props => {
    if (props === undefined)
      return {
        _type: tagName,
        props: {},
      }
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
): (props: SvgElementAttributes<N>) => FiendElement {
  return props => {
    return {
      _type: tagName,
      props,
    }
  }
}

export type SvgAttributes = Omit<SvgElementAttributes<'svg'>, 'width' | 'height'> & {
  width?: number
  height?: number
}
export type PolyLineAttributes = Omit<SvgElementAttributes<'polyline'>, 'points'> & {
  points?: string
}
