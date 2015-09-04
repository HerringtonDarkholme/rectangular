import {Tag} from './tags/elementRep'
import {TextRep} from './tags/nodeRep'
import {Prop} from './directives/prop'
import {Var} from './overkill/index'

export {Component} from './tags/component'
export * from './tags/index'
export {Tag} from './tags/elementRep'
export * from './tags/for'
export * from './tags/if'


export function p(name: string[]) {
  var prop = new Prop(name[0])
  return prop.toString()
}

export function t(initial: string[]) {
  return Var(initial[0])
}
