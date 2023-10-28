import {FiendElement, FiendNode, StandardProps, SvgElementAttributes} from '../../..'
import {ElementNamespace, ElementType, SvgElement} from '../../util/element'

/** @deprecated as this approach doesn't work well for Svg */
export function makeSvgElementConstructor<N extends keyof SVGElementTagNameMap>(
  tagName: N,
): (props: SvgElementAttributes<N>) => SvgElement {
  return props => {
    return {
      elementType: ElementType.dom,
      _type: tagName,
      namespace: ElementNamespace.svg,
      props,
    }
  }
}

export function makeSvgElementConstructor2<Props extends StandardProps & object>(
  tagName: keyof SVGElementTagNameMap,
): (props: Props) => SvgElement {
  return props => {
    return {
      elementType: ElementType.dom,
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

export const Svg = makeSvgElementConstructor('svg') as (
  ...args: [SvgAttributes] | FiendNode[]
) => FiendElement
export const Polyline = makeSvgElementConstructor('polyline') as (
  ...args: [PolyLineAttributes] | FiendNode[]
) => FiendElement
export const Polygon = makeSvgElementConstructor('polygon') as (
  ...args: [PolygonAttributes] | FiendNode[]
) => FiendElement
export const Circle = makeSvgElementConstructor('circle') as any
export const Title = makeSvgElementConstructor('title')
export const G = makeSvgElementConstructor('g')

export const Line = makeSvgElementConstructor2<{
  x1?: number
  x2?: number
  y1?: number
  y2?: number
  stroke?: string
  style?: string
}>('line')
