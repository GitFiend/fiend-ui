import type {CustomComponent} from '../component-types/pure-component'

export type StandardProps = {children?: FiendNode[]; key?: string}

export interface FiendElement<P extends StandardProps = StandardProps> {
  _type: keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | CustomComponent<P>
  props: P
}

export type FiendNode = FiendElement | string | number | null
