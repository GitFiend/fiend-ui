import {createElement} from './create-element'

const numLoops = 300000

describe('create element', () => {
  test('object creation performance', () => {
    testFunc(createElement)

    expect(true).toBe(true)
  })

  test('1 child', () => {
    const d = <h1>Heading</h1>

    expect(d).toEqual({
      type: 'h1',
      props: null,
      children: ['Heading'],
    })
  })

  test('2 children', () => {
    const d = (
      <div>
        <h1>Heading</h1>
        <p>paragraph</p>
      </div>
    )

    expect(d).toEqual({
      type: 'div',
      props: null,
      children: [
        {type: 'h1', props: null, children: ['Heading']},
        {type: 'p', props: null, children: ['paragraph']},
      ],
    })
  })

  test('child array', () => {
    const d = (
      <div>
        {[1, 2, 3].map((n) => (
          <div>{n}</div>
        ))}
      </div>
    )

    expect(d).toEqual({
      type: 'div',
      props: null,
      children: [
        [
          {
            type: 'div',
            props: null,
            children: [1],
          },
          {
            type: 'div',
            props: null,
            children: [2],
          },
          {
            type: 'div',
            props: null,
            children: [3],
          },
        ],
      ],
    })
  })

  test('child array mixed', () => {
    const d = (
      <div>
        <h1>Heading</h1>
        {[1, 2, 3].map((n) => (
          <div>{n}</div>
        ))}
      </div>
    )

    expect(d).toEqual({
      type: 'div',
      props: null,
      children: [
        {type: 'h1', props: null, children: ['Heading']},
        [
          {type: 'div', props: null, children: [1]},
          {type: 'div', props: null, children: [2]},
          {type: 'div', props: null, children: [3]},
        ],
      ],
    })
  })
})

function testFunc(f: Function) {
  const a: any[] = []

  // noinspection JSUnusedLocalSymbols
  const createElement = f

  console.time(f.name)
  for (let i = 0; i < numLoops; i++) {
    a.push(<div>Hello</div>)
  }
  console.timeEnd(f.name)
  console.log(a.slice(0, 1))
}
