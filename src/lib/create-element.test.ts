import {div, h1, p} from './host-components'

// const numLoops = 300000

describe('create element', () => {
  // test(`run createElement ${numLoops} times`, () => {
  //   testFunc(createElement)
  //
  //   expect(true).toBe(true)
  // })

  test('1 child', () => {
    const d = h1('Heading')

    expect(d).toEqual({
      _type: 'h1',
      props: null,
      children: ['Heading'],
    })
  })

  test('2 children', () => {
    const d = div(h1('Heading'), p('paragraph'))

    expect(d).toEqual({
      _type: 'div',
      props: null,
      children: [
        {_type: 'h1', props: null, children: ['Heading']},
        {_type: 'p', props: null, children: ['paragraph']},
      ],
    })
  })

  test('child array', () => {
    const d = div(...[1, 2, 3].map(n => div(n)))

    expect(d).toEqual({
      _type: 'div',
      props: null,
      children: [
        {
          _type: 'div',
          props: null,
          children: [1],
        },
        {
          _type: 'div',
          props: null,
          children: [2],
        },
        {
          _type: 'div',
          props: null,
          children: [3],
        },
      ],
    })
  })

  test('child array mixed', () => {
    const d = div(h1('Heading'), ...[1, 2, 3].map(n => div(n)))

    expect(d).toEqual({
      _type: 'div',
      props: null,
      children: [
        {_type: 'h1', props: null, children: ['Heading']},
        {_type: 'div', props: null, children: [1]},
        {_type: 'div', props: null, children: [2]},
        {_type: 'div', props: null, children: [3]},
      ],
    })
  })
})

// function testFunc(f: Function) {
//   const a: any[] = []
//
//   // noinspection JSUnusedLocalSymbols
//   const createElement = f
//
//   console.time(f.name)
//   for (let i = 0; i < numLoops; i++) {
//     a.push(<div>Hello</div>)
//   }
//   console.timeEnd(f.name)
//   console.log(a.slice(0, 1))
// }