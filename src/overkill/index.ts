/// <reference path='../../typings/es6-collections.d.ts' />
import 'es6-collections'
import {Signal, VarImp, RxImp, ObsImp} from './ok'
import {Subscriber as Sub} from './ok'
import {DiffStrategy} from '../diff/index'
import {throttle, debounce, identity} from '../util'

export type _ = {}
export {ObsImp} from './ok'
export type Sig<V> = Var<V> | Rx<V, _>

export interface Var<T> {
  (): T
  (t: T): void
}

var funcMap = new WeakMap<Function, Signal<_, _>>()

interface VarAPI {
  <T>(t: T): Var<T>
  mutate<T>(v: Var<T>, func: (t: T) => any)
  byDiff(dff: DiffStrategy): <T>(t: T) => Var<T>
  throttle<T>(interval: number, initialValue?: T): Var<T>
  debounce<T>(interval: number, initialValue?: T): Var<T>
  config(config: Object): <T>(t: T) => Var<T>
}

interface VarConfig {
  diff?: DiffStrategy
  throttle?: number
  debounce?: number
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

Var.mutate = function mutate<T>(v: Var<T>, func: (t: T) => any) {
  var vImp: VarImp<T, _> = funcMap.get(v) as any
  vImp.updateRef(func)
}

Var.config = function(config: VarConfig) {
  let wrapper: <T>(t: T) => T
  if (config.throttle) {
    wrapper = (fn) => throttle(fn, config.throttle)
  } else if (config.debounce) {
    wrapper = (fn) => debounce(fn, config.debounce)
  } else {
    wrapper = identity
  }
  return function<T>(initialValue: T) {
    var vImp = new VarImp(initialValue, config.diff)
    var func = function (t?: any) {
      if (arguments.length === 0)  {
        return vImp.apply()
      } else {
        vImp.update(t)
      }
    }
    func = wrapper(func)
    funcMap.set(func, vImp)
    return func
  }
}

Var.byDiff = function (diff: DiffStrategy) {
  return Var.config({diff})
}

Var.throttle = function<T>(wait: number, init?: T) {
  return Var.config({throttle: wait})(init)
}

Var.debounce = function<T>(wait: number, init?: T) {
  return Var.config({debounce: wait})(init)
}

interface RxAPI {
  <T, C>(t: (c: C) => T): Rx<T, C>
  byDiff(dff: DiffStrategy): <T, C>(t: T) => Rx<T, C>
}

export interface Rx<T, C> {
  (): T
}
export var Rx: RxAPI = function <T, C>(fn: (c: C) => T): Rx<T, C> {
  var rxImp = new RxImp(fn)
  var func = () => rxImp.apply()
  funcMap.set(func, rxImp)
  return func
} as any

Rx.byDiff = (diff: DiffStrategy) => {
  return function <T, C>(fn: (c: C) => T): Rx<T, C> {
    var rxImp = new RxImp(fn, diff)
    var func = () => rxImp.apply()
    funcMap.set(func, rxImp)
    return func
  }
}

interface _ObsAPI {
  <V, C>(fn: Var<V>, sub?: Sub<V>): ObsImp<V, C>
  <V, C>(fn: Rx<V, C>, sub?: Sub<V>): ObsImp<V, C>
  <V, C>(fn: (c: C) => V, sub?: Sub<V>): ObsImp<V, C>
}
interface ObsAPI extends _ObsAPI {
  byDiff(diff: DiffStrategy): _ObsAPI
}

export var Obs: ObsAPI = function Obs<V, C>(fn: (c: C) => V, sub?: Sub<V>): ObsImp<V, C> {
  return new ObsImp(fn, sub)
} as any

Obs.byDiff = (diff: DiffStrategy) => {
  return function Obs<V, C>(fn: (c: C) => V, sub?: Sub<V>): ObsImp<V, C> {
    return new ObsImp(fn, sub, diff)
  }
}

export function getSignal(f: Var<_> | Rx<_, _>): Signal<_, _> {
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

