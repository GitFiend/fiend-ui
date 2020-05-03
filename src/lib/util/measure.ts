//

export function time(name: string): void {
  if (__DEV__) {
    performance.mark(`${name} start`)
  }
}

export function timeEnd(name: string): void {
  if (__DEV__) {
    performance.mark(`${name} end`)
    performance.measure(name, `${name} start`, `${name} end`)
  }
}

/*
 performance.mark('Iteration Start')
    Iteration()
    performance.mark('Iteration End')
    performance.measure(
        'Iteration',
        'Iteration Start',
        'Iteration End'
    )
 */
