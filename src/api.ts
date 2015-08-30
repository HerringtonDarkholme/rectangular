import {Tag} from './tags/elementRep'
import {TextRep} from './tags/nodeRep'
import {Prop} from './directives/prop'
import Observable from './observable'
import {Var} from './overkill/index'

export * from './tags/div'
export * from './tags/input'
export {Tag} from './tags/elementRep'
export * from './tags/for'
export * from './tags/if'

export class Component extends Tag<HTMLElement> {
  render<T extends HTMLElement>(): Tag<T> {throw new Error('not implemented')}
  _render() {
    return this.render()._render()
  }
}

export function p(name: string[]) {
  var prop = new Prop(name[0])
  return prop.toString()
}

export function t(initial: string[]) {
  return Var(initial[0])
}
