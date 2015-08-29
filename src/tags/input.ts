import {VoidElement} from './elementRep'
import {ChildTag} from './nodeRep'
import eventManager from '../events/index'
import {Obs} from '../overkill/index'

class Input extends VoidElement<HTMLInputElement> {
  constructor(props: any) {
    super(props)
  }
  _render() {
    var elem = document.createElement('input')
    this.element = elem
    let obj = this.props
    for (let key in obj) {
      this.polymorphicBind(elem, key, obj[key])
      if (key.indexOf('value@_@') === 0 && key in this._linkedDirectives) {
        (function(obs) {
          eventManager.on(elem, 'keyup', function() {
            obs.v(elem.value)
          })
        })(this._linkedDirectives[key])
      }
    }
    return elem
  }
}
export function input(props: any) {
  return new Input(props)
}
