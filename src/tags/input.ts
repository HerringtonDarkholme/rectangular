import {VoidElement} from './elementRep'
import {ChildTag} from './nodeRep'
import eventManager from '../events/index'

class Input extends VoidElement<HTMLInputElement> {
  constructor(props: any) {
    super(props)
  }
  _render() {
    var elem = document.createElement('input')
    let obj = this.props
    for (let key in obj) {
      this.polymorphicBind(elem, key, obj[key])
      if (key.indexOf('value') === 0 && key in this._linkedDirectives) {
        (function(obs) {
          eventManager.on(elem, 'keyup', function() {
            obs.value = elem.value
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
