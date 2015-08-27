/// <reference path='../../typings/es6-collections.d.ts' />
import 'es6-collections'
import {Signal, VarImp, RxImp, ObsImp} from './ok'

export type _ = {}

export enum UpdatePolicy {
  FORCE, BY_REFERENCE
}

export interface Var<T> {
  (): T
  (t: T): void
  (t: T, byRef: UpdatePolicy): void
  (fn: (t: T) => boolean, byRef: UpdatePolicy): void
}
var funcMap = new WeakMap<Function, Signal<_, _>>()

export function Var<T>(initialValue: T): Var<T> {
  var vImp = new VarImp(initialValue)
  var func = (t?: any, policy?: UpdatePolicy) => {
    switch (policy) {
    case UpdatePolicy.FORCE:
      vImp.update(t, true)
      break;
    case UpdatePolicy.BY_REFERENCE:
      if (typeof t !== 'function') {
        throw new Error('updateRef should use function')
      }
      vImp.updateRef(t)
      break
    default:
      if (t === undefined)  {
        return vImp.apply()
      } else {
        vImp.update(t)
      }
      break
    }
  }
  funcMap.set(func, vImp)
  return func
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

export function Obs<C>(fn: (c: C) => void): ObsImp<C> {
  return new ObsImp(fn)
}

export function getSinalFromFunc(f: Function): Signal<_, _> {
  return funcMap.get(f)
}

export function dispose(f: Function) {
  let sig = funcMap.get(f)
  if (!sig) return
  if (!(sig instanceof ObsImp)) {
    console.warn('dispose non observable!')
  }
  sig.dispose()
}
