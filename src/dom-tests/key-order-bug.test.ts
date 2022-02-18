import {mkRoot} from './test-helpers'
import {ScaleElements} from './key-order-bug'

describe('key order bug', () => {
  test('Scale at position 0', () => {
    const root = mkRoot()

    root.render(ScaleElements.$({position: 0}))

    expect(root.element.innerHTML).toEqual(
      '<div><div>element 0</div><div>element 1</div><div>element 2</div></div>'
    )

    root.render(ScaleElements.$({position: 1}))

    expect(root.element.innerHTML).toEqual(
      '<div><div>element 1</div><div>element 2</div><div>element 3</div></div>'
    )

    root.render(ScaleElements.$({position: 7}))
    root.render(ScaleElements.$({position: 1}))
    root.render(ScaleElements.$({position: 0}))

    expect(root.element.innerHTML).toEqual(
      '<div><div>element 0</div><div>element 1</div><div>element 2</div></div>'
    )

    // console.log(root.element.innerHTML)
  })
})
