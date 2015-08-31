import {Tag} from './tags/elementRep'

export function TagName(tagName: string): (t: Function) => void {
  return function(t: Function) {
    Object.defineProperty(t, '__name__', {
      value: tagName,
      enumerable: false
    })
  }
}

interface Class<T> {
  new (): T
}
export
function Template<T>(
  templateFn: (t: T) => Tag<HTMLElement>
): (ctor: Class<T>) => void {
  return function(ctor: Class<T>) {
    Object.defineProperty(ctor.prototype, 'render', {
      value: function() {templateFn.call(this, this)}
    })
  }
}
