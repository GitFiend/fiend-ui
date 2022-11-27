// This just returns the string that would have been without the function call.
export function s(
  literals: TemplateStringsArray,
  ...placeholders: (string | number)[]
): string {
  return literals.map((str, i) => str + (placeholders[i] ?? '')).join('')
}

export const t = s

export function c(names: TemplateStringsArray, ...flags: boolean[]): string {
  if (names.length === 1) return names[0]

  let classes = ''
  for (let i = 0; i < names.length; i++) {
    if (flags[i]) classes += names[i]
  }
  return classes.trim()
}
