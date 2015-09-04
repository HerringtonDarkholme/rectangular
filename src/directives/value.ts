import {Prop} from './prop'
import {ElementRep} from '../tags/elementRep'
import {Obs} from '../overkill/index'
import eventManager from '../events/index'

export class Value extends Prop<string> {
  private handler: Function
  bind<E extends ElementRep<HTMLInputElement>>(ele: E) {
    let directive = this
    let element = ele.element
    if (!(element instanceof HTMLInputElement)) return
    super.bind(ele)
    this.handler = function() {
      directive.v(this.value)
    }
    eventManager.on(element, 'keyup', this.handler)
  }
  unbind<E extends ElementRep<HTMLInputElement>>(ele: E) {
    super.unbind(ele)
    eventManager.off(ele.element, 'keyup', this.handler)
  }
}
