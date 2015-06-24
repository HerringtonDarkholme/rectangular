import Directive from './directive'
import {ElementRep} from '../tags/elementRep'
import {write} from '../render'
import Observable from '../observable'

type ClassStrings = string | string[] | Observable<string>
export class Class extends Directive<ClassStrings> {
  bind<E extends HTMLElement>(ele: E, value: ClassStrings) {
    if (typeof value === 'string') {
      write(() => ele.className = value)
    } else if (Array.isArray(value)) {
      write(() => ele.classList.add(...<string[]>value))
    } else if (value instanceof Observable) {
      value.onChange(function(oldValue, newValue) {
        write(() => this.bind(ele, newValue))
      })
      write(() => this.bind(ele, value.value))
    }
  }
}
