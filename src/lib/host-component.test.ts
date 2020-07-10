import {div} from './host-components'

describe('div renders', () => {
  test('no args', () => {
    const el = div()

    expect(el).toEqual({
      type: 'div',
      props: null,
      children: null,
    })
  })

  test('single element arg', () => {
    const el = div('hello')

    expect(el).toEqual({
      type: 'div',
      props: null,
      children: ['hello'],
    })
  })

  test('single attribute arg', () => {
    const el = div({className: 'hi'})

    expect(el).toEqual({
      type: 'div',
      props: {className: 'hi'},
      children: null,
    })
  })

  test('both attributes and elements', () => {
    const el = div({className: 'hi'}, 'hello')

    expect(el).toEqual({
      type: 'div',
      props: {className: 'hi'},
      children: ['hello'],
    })
  })
})
