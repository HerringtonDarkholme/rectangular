import Directive from './directive'
import {Tag} from '../tags/elementRep'
import {write} from '../render'
import {Obs, Var} from '../overkill/index'

export class Attr<V> extends Directive<V> {
  constructor(public name: string) {
    super()
  }
  bind<E extends Tag<HTMLElement>>(ele: E) {
    let key = this.name
    this.o = Obs(() => {
      let newValue = this.v().toString()
      write(() => ele.element.setAttribute(key, newValue))
    })
  }
}
