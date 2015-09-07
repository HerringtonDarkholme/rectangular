import Directive from './directive'
import {Tag} from '../tags/elementRep'
import {write} from '../render'
import {Obs} from '../overkill/index'

export class Prop<V> extends Directive<V> {
  constructor(public name: string) {
    super()
  }
  bind<E extends Tag<HTMLElement>>(ele: E) {
    let key = this.name
    this.o = Obs(() => {
      let newValue = this.v()
      write(() => ele.element[key] = newValue)
    })
    ele[key] = this.v
  }
}
