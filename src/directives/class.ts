import Directive from './directive'
import {ElementRep} from '../tags/elementRep'
import {write} from '../render'
import Observable from '../observable'

export class Class extends Directive<string[]> {
  bind<E extends HTMLElement>(ele: E, value: string | string[]) {
    if (typeof value === 'string') {
      this.value = [value]
      write(() => ele.className = value)
    } else if (Array.isArray(value)) {
      this.value = value
      write(() => ele.classList.add(...<string[]>value))
    }
    this.onChange(function(oldValue, newValue) {
      write(() => ele.classList)
    })
  }
}
