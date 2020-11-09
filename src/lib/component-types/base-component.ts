import {HostComponent} from './host/host-component'
import {TextComponent} from './text-component'
import {PureComponent} from './pure-component'
import {RootComponent} from './root-component'

export type AnyComponent = HostComponent | TextComponent | PureComponent
export type ParentComponent = PureComponent | RootComponent | HostComponent
export type ElementComponent = HostComponent | TextComponent

export enum ComponentType {
  host,
  custom,
  text,
}

export interface ComponentBase {
  _type: ComponentType
  parentHost: HostComponent | RootComponent
  order: string

  // Remove the component and run cleanup. Not necessarily related to element removal.
  remove(): void
}
