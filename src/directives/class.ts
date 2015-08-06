import Directive from './directive'
import {ElementRep} from '../tags/elementRep'
import {write} from '../render'
import Observable from '../observable'

export class Class extends Directive<string[]> {
  bind<E extends ElementRep<HTMLElement>>(ele: E, value: string | string[]) {
    if (typeof value === 'string') {
      this.v = [value]
      write(() => ele.element.className = value)
    } else if (Array.isArray(value)) {
      this.v = value
      write(() => ele.element.classList.add(...<string[]>value))
    }
    this.onChange(function(oldValue, newValue) {
      write(() => {
        ele.element.classList.remove(...oldValue)
        ele.element.classList.add(...newValue)
      })
    })
  }
}
