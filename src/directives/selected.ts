import Directive from './directive'
import {ElementRep} from '../tags/elementRep'
import {Obs} from '../overkill/index'
import eventManager from '../events/index'

export class SelectedOption extends Directive<string> {
  private handler: Function
  bind<E extends ElementRep<HTMLSelectElement>>(ele: E) {
    let directive = this
    let element = ele.element
    if (!(element instanceof HTMLSelectElement)) return
    Obs(this.v, function(newValue) {
      let opts = element.options
      for (let i = 0, l = opts.length; i < l; i++) {
        let opt = opts[i]
        if (opt.value === newValue) {
          opt.selected = true
          return
        }
      }
    })
    this.handler = function() {
      directive.v(this.options[this.selectedIndex].value)
    }
    eventManager.on(element, 'change', this.handler)
  }
  unbind<E extends ElementRep<HTMLInputElement>>(ele: E) {
    super.unbind(ele)
    eventManager.off(ele.element, 'change', this.handler)
  }
}
