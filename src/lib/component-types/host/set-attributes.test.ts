import {setAttributesFromProps, updateAttributes} from './set-attributes'
import {Rec} from '../pure-component'
import {Button} from './dom-components'
import {render} from '../../render'
import {ElementNamespace} from '../../util/element'

describe('setAttributesFromProps', () => {
  test('add class', () => {
    const parent = document.createElement('div')
    const div = document.createElement('div')

    parent.appendChild(div)

    const props: Partial<HTMLDivElement> = {
      className: 'simple',
    }

    setAttributesFromProps(div, ElementNamespace.html, props as Rec)

    expect(parent.innerHTML).toEqual('<div class="simple"></div>')
  })
})

describe('updateAttributes', () => {
  test('update props', () => {
    const parent = document.createElement('div')
    const div = document.createElement('div')

    parent.appendChild(div)

    const props: Partial<HTMLDivElement> = {
      className: 'simple',
    }

    setAttributesFromProps(div, ElementNamespace.html, props as Rec)

    expect(parent.innerHTML).toEqual('<div class="simple"></div>')

    const newProps: Partial<HTMLDivElement> = {
      id: 'simple',
    }

    updateAttributes(div, ElementNamespace.html, newProps as Rec, props as Rec)

    expect(parent.innerHTML).toEqual('<div id="simple"></div>')
  })
})

describe('handling of undefined props', () => {
  test(`expect undefined attributes don't show on element on first set`, () => {
    const parent = document.createElement('div')
    const div = document.createElement('div')

    parent.appendChild(div)

    const props: Partial<HTMLDivElement> = {
      id: undefined,
    }

    setAttributesFromProps(div, ElementNamespace.html, props as Rec)

    expect(parent.innerHTML).toEqual('<div></div>')
  })

  test(`expect undefined attributes don't show on element after previously defined`, () => {
    const parent = document.createElement('div')
    const div = document.createElement('div')

    parent.appendChild(div)

    const props: Partial<HTMLDivElement> = {
      id: 'simple',
    }

    setAttributesFromProps(div, ElementNamespace.html, props as Rec)

    expect(parent.innerHTML).toEqual('<div id="simple"></div>')

    const newProps: Partial<HTMLDivElement> = {
      id: undefined,
    }

    updateAttributes(div, ElementNamespace.html, newProps as Rec, props as Rec)

    expect(parent.innerHTML).toEqual('<div></div>')
  })
})

describe('Applies expected attribute', () => {
  test('disabled', () => {
    render(Button({disabled: true}), document.body)
    const b = document.getElementsByTagName('button').item(0)
    expect(b?.disabled).toEqual(true)

    render(Button({disabled: false}), document.body)

    const b2 = document.getElementsByTagName('button').item(0)
    expect(b2?.disabled).toEqual(false)
  })
})
