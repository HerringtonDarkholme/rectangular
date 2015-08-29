import Directive from './directive'
import {ElementRep} from '../tags/elementRep'
import {write} from '../render'
import {Obs} from '../overkill/index'

export class Class extends Directive<string[]> {
  bind<E extends ElementRep<HTMLElement>>(ele: E, value: string | string[]) {
    if (typeof value === 'string') {
      super.bind(ele, [value])
      write(() => ele.element.className = value)
    } else if (Array.isArray(value)) {
      super.bind(ele, value)
      write(() => ele.element.classList.add(...value))
    }
    Obs(this.v, (newValue: string[], oldValue) => {
      write(() => {
        ele.element.classList.remove(...oldValue)
        ele.element.classList.add(...newValue)
      })
    })
  }
}
