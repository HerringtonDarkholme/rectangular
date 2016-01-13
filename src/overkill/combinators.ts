import {Rx, Var, getSignal} from './index'
import {peek as _peek} from './ok'

type _ = {}

function map<U, V>(v: Var<U>, fn: (t:U) => V): Rx<V, _> {
  return Rx(() => fn(v()))
}

function filter<U>(v: Var<U>, fn: (t: U) => boolean): Rx<U, _> {
  return Rx(() => {
    if (fn(v())) return v()
  })
}

function peek<U>(o: Var<U>): U {
  let sig: any = getSignal(o)
  return <any>_peek(sig)
}
