import {$F} from './component-types/fragment'
import {div} from './component-types/host/host-components'
import {render} from './render'

describe('render', () => {
  test('repeat render', () => {
    const el = document.createElement('div')

    let t = $F(div('a'), div('b'), div('c'))

    render(t, el)

    expect(el.innerHTML).toEqual('<div>a</div><div>b</div><div>c</div>')

    t = $F(div('a'), div('b'), div('c'), div('d'))

    render(t, el)

    expect(el.innerHTML).toEqual('<div>a</div><div>b</div><div>c</div><div>d</div>')

    t = $F(div('d'), div('a'), div('b'), div('c'))

    render(t, el)

    expect(el.innerHTML).toEqual('<div>d</div><div>a</div><div>b</div><div>c</div>')
  })
})
