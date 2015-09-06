import Directive from './directive'
import {Tag} from '../tags/elementRep'
import {write} from '../render'
import {Obs} from '../overkill/index'

interface DataDef {
  [key: string]: string
}

export class Data extends Directive<DataDef> {
  bind<E extends Tag<HTMLElement>>(ele: E) {
    let data = this.v()
    let element = ele.element
    write(() => {
      for (let key in Object.keys(data)) {
        element.setAttribute(`data-${key}`, data[key])
      }
    })
    Obs(this.v, (newValue, oldValue) => {
      write(() => {
        for (let key of Object.keys(oldValue)) {
          if (key in newValue) continue
          element.removeAttribute(`data-${key}`)
        }
        for (let key of Object.keys(newValue)) {
          if (key in oldValue) continue
          element.setAttribute(`data-${key}`, data[key])
        }
      })
    })
  }
}
