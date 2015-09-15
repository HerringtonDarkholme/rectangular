import {Tag} from './tags/elementRep'
import {getSignal} from './overkill/index'

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
): (ctor: Class<T>) => Class<T> {
  return (ctor: Class<T>) => {
    let newCtor =  function () {
      ctor.apply(this, arguments)
      for (let name of Object.keys(this)) {
        let signal = getSignal(this[name])
        if (signal && signal.context !== undefined) {
          signal.context = this
        }
      }
      return this
    }
    for (let key in ctor) {
      newCtor[key] = ctor[key]
    }
    newCtor.prototype = Object.create(ctor.prototype)
    Object.defineProperty(ctor.prototype, 'render', {
      value: function() {return templateFn.call(this, this)}
    })
    return newCtor as any
  }
}
