import {HTMLAttributes} from 'react'
import {setAttributesFromProps, updateAttributes} from './set-attributes'
import {Rec} from '../component'
import {button} from '../../host-components'
import {render} from '../../render'

describe('setAttributesFromProps', () => {
  test('add class', () => {
    const parent = document.createElement('div')
    const div = document.createElement('div')

    parent.appendChild(div)

    const props: HTMLAttributes<HTMLDivElement> = {
      className: 'simple',
    }

    setAttributesFromProps(div, props as Rec)

    expect(parent.innerHTML).toEqual('<div class="simple"></div>')
  })
})

describe('updateAttributes', () => {
  test('update props', () => {
    const parent = document.createElement('div')
    const div = document.createElement('div')

    parent.appendChild(div)

    const props: HTMLAttributes<HTMLDivElement> = {
      className: 'simple',
    }

    setAttributesFromProps(div, props as Rec)

    expect(parent.innerHTML).toEqual('<div class="simple"></div>')

    const newProps: HTMLAttributes<HTMLDivElement> = {
      id: 'simple',
    }

    updateAttributes(div, newProps as Rec, props as Rec)

    expect(parent.innerHTML).toEqual('<div id="simple"></div>')
  })
})

describe('Applies expected attribute', () => {
  test('disabled', () => {
    render(button({disabled: true}, ''), document.body)
    const b = document.getElementsByTagName('button').item(0)
    expect(b?.disabled).toEqual(true)

    render(button({disabled: false}, ''), document.body)

    const b2 = document.getElementsByTagName('button').item(0)
    expect(b2?.disabled).toEqual(false)
  })
})
