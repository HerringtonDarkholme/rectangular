export function TagName(tagName: string): (t: Function) => void {
  return function(t: Function) {
    Object.defineProperty(t, '__name__', {
      value: tagName,
      enumerable: false
    })
  }
}
