import {HTMLAttributes} from 'react'
import {setAttributesFromProps, updateAttributes} from './set-attributes'
import {Rec} from '../component'

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
