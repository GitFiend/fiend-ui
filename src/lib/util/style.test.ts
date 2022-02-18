import {c, mc, s} from './style'

describe('s - tagged style string template function', () => {
  const text = 'width: 50px; height: 2px;'
  const style = s`width: 50px; height: 2px;`

  test(text, () => {
    expect(style).toEqual(text)
  })

  test('empty string', () => {
    expect(s``).toEqual('')
  })

  test('templates', () => {
    expect(s`height: ${50}px; width: ${30}px`).toEqual('height: 50px; width: 30px')
  })
})

describe('class merging', () => {
  test('generates expected class string when given bool flags', () => {
    expect(c`CloneDialog ${true}`).toEqual('CloneDialog')
    expect(c`CloneDialog ${false}`).toEqual('')

    expect(c`omg ${true} nah ${false}`).toEqual('omg')
    expect(c`omg ${false} nah ${true}`).toEqual('nah')
    expect(c`omg ${false} nah ${false}`).toEqual('')
    expect(c`omg`).toEqual('omg')
    expect(c`omg nah`).toEqual('omg nah')
  })

  xtest('compare speed', () => {
    const num = 1000000

    let s: string

    console.time('plain')
    for (let i = 0; i < num; i++) {
      s = `omg`
      s = `omg2`
    }
    console.timeEnd('plain')

    console.time('c')
    for (let i = 0; i < num; i++) {
      s = c`omg ${true} nah ${false} blah ${false}`
      s = c`omg2`
    }
    console.timeEnd('c')

    console.time('mc')
    for (let i = 0; i < num; i++) {
      s = mc('omg', {
        nah: false,
        blah: false,
      })
      s = mc('omg2', {})
    }
    console.timeEnd('mc')
  })
})
