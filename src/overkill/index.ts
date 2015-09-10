/// <reference path='../../typings/es6-collections.d.ts' />
import 'es6-collections'
import {Signal, VarImp, RxImp, ObsImp} from './ok'
import {Subscriber as Sub} from './ok'
export {ObsImp} from './ok'

export type _ = {}

export interface Var<T> {
  (): T
  (t: T): void
}
var funcMap = new WeakMap<Function, Signal<_, _>>()

interface VarAPI {
  <T>(t: T): Var<T>
  mutate<T>(v: Var<T>, func: (t: T) => boolean)
}


export var Var = function Var<T>(initialValue: T): Var<T> {
  var vImp = new VarImp(initialValue)
  var func = function (t?: any) {
      if (arguments.length === 0)  {
        return vImp.apply()
      } else {
        vImp.update(t)
      }
    }
  funcMap.set(func, vImp)
  return func
} as VarAPI

Var.mutate = function mutate<T>(v: Var<T>, func: (t: T) => boolean) {
  var vImp: VarImp<T, _> = funcMap.get(v) as any
  vImp.updateRef(func)
}

export interface Rx<T, C> {
  (): T
}
export function Rx<T, C>(fn: (c: C) => T): Rx<T, C> {
  var rxImp = new RxImp(fn)
  var func = () => rxImp.apply()
  funcMap.set(func, rxImp)
  return func
}

export function Obs<V, C>(fn: Var<V>, sub?: Sub<V>): ObsImp<V, C>
export function Obs<V, C>(fn: Rx<V, C>, sub?: Sub<V>): ObsImp<V, C>
export
function Obs<V, C>(fn: (c: C) => V, sub?: Sub<V>): ObsImp<V, C> {
  return new ObsImp(fn, sub)
}

export function getSinal(f: Var<_> | Rx<_, _>): Signal<_, _> {
  return funcMap.get(f)
}
export function isSignal(f: any): f is Sig<_> {
  return funcMap.get(f) !== undefined
}

export function dispose(f: Function) {
  let sig = funcMap.get(f)
  if (!sig) return
  if (!(sig instanceof ObsImp)) {
    console.warn('dispose non observable!')
  }
  sig.dispose()
}

export type Sig<V> = Var<V> | Rx<V, _>
