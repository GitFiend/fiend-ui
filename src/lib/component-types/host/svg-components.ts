import {FiendElement, FiendNode, SvgElementAttributes} from '../../..'
import {ElementNamespace, ElementType, SvgElement} from '../../util/element'

/** @deprecated as this approach doesn't work well for Svg */
export function makeSvgElementConstructor<N extends keyof SVGElementTagNameMap>(
  tagName: N
): (props: SvgElementAttributes<N> | string) => SvgElement {
  return props => {
    if (typeof props === 'string')
      return {
        elementType: ElementType.host,
        _type: tagName,
        namespace: ElementNamespace.svg,
        props: {
          children: [props],
        },
      }
    return {
      elementType: ElementType.host,
      _type: tagName,
      namespace: ElementNamespace.svg,
      props,
    }
  }
}

export function makeSvgElementConstructor2<Props>(
  tagName: keyof SVGElementTagNameMap
): (props: Props) => SvgElement {
  return props => {
    return {
      elementType: ElementType.host,
      _type: tagName,
      namespace: ElementNamespace.svg,
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
  strokeLinejoin?: string
  stroke?: string
  strokeWidth?: string
  fill?: string
}
export type PolygonAttributes = Omit<SvgElementAttributes<'polygon'>, 'points'> & {
  points?: string
  strokeLinejoin?: string
  stroke?: string
  strokeWidth?: string
  fill?: string
}

export const svg = makeSvgElementConstructor('svg') as (
  ...args: [SvgAttributes] | FiendNode[]
) => FiendElement
export const polyline = makeSvgElementConstructor('polyline') as (
  ...args: [PolyLineAttributes] | FiendNode[]
) => FiendElement
export const polygon = makeSvgElementConstructor('polygon') as (
  ...args: [PolygonAttributes] | FiendNode[]
) => FiendElement
export const circle = makeSvgElementConstructor('circle') as any
export const title = makeSvgElementConstructor('title')
export const g = makeSvgElementConstructor('g')

export const line = makeSvgElementConstructor2<{
  x1?: number
  x2?: number
  y1?: number
  y2?: number
  stroke?: string
}>('line')
