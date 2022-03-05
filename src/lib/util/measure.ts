//

export function time(name: string): void {
  if (__DEV__ && typeof window !== 'undefined') {
    performance.mark(`${name} start`)
  }
}

export function timeEnd(name: string): void {
  if (__DEV__ && typeof window !== 'undefined') {
    performance.mark(`${name} end`)
    performance.measure(name, `${name} start`, `${name} end`)
  }
}

export function timeF(f: () => void, name: string) {
  time(name)
  f()
  timeEnd(name)
}

export function timeF2(f: () => void, name: string) {
  console.time(name)
  f()
  console.timeEnd(name)
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
