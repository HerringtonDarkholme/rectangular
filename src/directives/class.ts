import Directive from './directive'
import {Tag} from '../tags/elementRep'
import {write} from '../render'
import {Obs} from '../overkill/index'

export class Class extends Directive<string[]> {
  bind<E extends Tag<HTMLElement>>(ele: E) {
    let value = this.v()
    write(() => ele.element.classList.add(...value))
    Obs(this.v, (newValue: string[], oldValue) => {
      write(() => {
        ele.element.classList.remove(...oldValue)
        ele.element.classList.add(...newValue)
      })
    })
  }
}
