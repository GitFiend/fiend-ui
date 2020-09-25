// This just returns the string that would have been without the function call.
export function s(
  literals: TemplateStringsArray,
  ...placeholders: (string | number)[]
): string {
  return literals.map((str, i) => str + (placeholders[i] ?? '')).join('')
}

export function c(names: TemplateStringsArray, ...flags: boolean[]): string {
  if (names.length === 1) return names[0]

  let classes = ''
  for (let i = 0; i < names.length; i++) {
    if (flags[i]) classes += names[i]
  }
  return classes.trim()
}

export function mc(initialClass: string, mapping: Record<string, boolean>): string {
  let classes = ''

  for (const key in mapping) {
    if (mapping.hasOwnProperty(key) && mapping[key] === true) {
      classes += ' ' + key
    }
  }

  return initialClass + classes
}
