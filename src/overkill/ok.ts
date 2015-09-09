/// <reference path='../../typings/es6-collections.d.ts' />
import 'es6-collections'

export class Caller<T> {
  private callers: T[] = []
  constructor(init?: T) {
    if (init !== undefined) this.callers.push(init)
  }
  withValue(t: T): Function {
    if (this.callers.indexOf(t) >= 0) throw new Error('cyclic')
    return (fn: Function) => {
      this.callers.push(t)
      try {
        let ret = fn()
        return ret
      } finally {
        this.callers.pop()
      }
    }
  }
  value() {
    return this.callers[this.callers.length-1]
  }
}

export type _ = {}
export type Observer = ObsImp<_, _> | RxImp<_, _>
export type Observee = VarImp<_, _> | RxImp<_, _>


export const UNINTIALIZE: any = {}
export abstract class Signal<T, C> {
  public value: T = UNINTIALIZE
  abstract dispose(v?: Observer): void
  public context: C
}

// a flag indicates whether to track dependency
// true when observer calls observee, otherwise false
var inWatch = false
export function execInWatch(fn: Function) {
  let oldState = inWatch
  inWatch = true
  fn()
  inWatch = oldState
}
export function execOutOfWatch(fn: Function) {
  let oldState = inWatch
  inWatch = false
  fn()
  inWatch = oldState
}

/*
 * In dependency graph, we have three kinds of node
 * Var: the root of graph, the source of change. observed by Rx/Obs
 * Rx: interior node, it observes Var/Rx changes, and notify other Rx/Obs
 * Obs: leaf node, it should executes side effect,
 *
 * In dependency graph, we can define parent node as observee and child node as observer.
 * Child node will `watch` parent node. Parent node will notify child node when itself changes.
 *
 * Var & Rx are observees. Observee has its own value, and a set of observer.
 * When observees get called in watch phase, it will add the caller to its observer set,
 * and add itself to caller's observee list.
 *
 * Rx & Obs are observers. Observer has a list of observee. Obs is only for side effect.
 * Observer has a computeValue method in which observer calls observee.
 * Every time computeValue executes, observer will clean its observee list,
 * and remove itself from observee's observer set.
 */

export class VarImp<T, C> extends Signal<T, C> {
  private observers = new Set<Observer>()
  constructor(value: T) {
    super()
    this.update(value)
  }

  // observer is agnostic about its expression
  // so we register dependency when observee get called
  apply(): T {
    if (inWatch) {
      let callSig = caller.value()
      callSig.watch(this)
      this.observers.add(callSig)
    }
    return this.value
  }

  // when Var update, all its observers should re-watch
  update(newValue: T, force?: boolean): C {
    if (this.value !== newValue || force) {
      inWatch = true
      this.value = newValue
      var obs = this.observers
      this.observers = new Set<any>()
      obs.forEach(o => o.computeValue())
      flushPendingObserver()
      inWatch = false
    }
    return this.context
  }
  updateRef(func: (t: T) => boolean|void): C {
    let skipUpdate = func(this.value)
    if (skipUpdate !== true) {
      inWatch = true
      var obs = this.observers
      this.observers = new Set<any>()
      obs.forEach(o => o.computeValue())
      flushPendingObserver()
      inWatch = false
    }
    return this.context
  }

  retireFrom(obs: Observer) {
    this.observers.delete(obs)
  }

  dispose(obs?: Observer) {
    if (obs === undefined) {
      this.observers.forEach(o => o.dispose())
      this.observers = null
      this.value = null
    } else {
      this.observers.delete(obs)
    }
  }
}

export type Subscriber<V> = (n: V, o: V) => void
const NOOP = () => void 0
var pendingObserverSet = new Set<ObsImp<_,_>>()
function flushPendingObserver() {
  pendingObserverSet.forEach(obs => obs['_makeSideEffect']())
  pendingObserverSet.clear()
}

export class ObsImp<V, C> extends Signal<V, C> {
  private observees: Array<Observee> = []
  private expr: (ctx: C) => V
  private sideEffect: Subscriber<V>

  constructor(expr: (ctx: C) => V, sideEffect?: Subscriber<V>) {
    super()
    this.expr = expr
    this.sideEffect = sideEffect || NOOP
    inWatch = true
    this._makeSideEffect()
    inWatch = false
  }

  computeValue() {
    pendingObserverSet.add(this)
  }

  private _makeSideEffect() {
    for (let sig of this.observees) {
      sig.retireFrom(this)
    }
    this.observees = []
    let ctx = this.context
    let fn = this.expr.bind(ctx, ctx)
    let newValue = caller.withValue(this)(fn)
    if (this.value !== UNINTIALIZE) {
      let oldState = inWatch
      inWatch = false
      this.sideEffect(newValue, this.value)
      inWatch = oldState
    }
    this.value = newValue
  }
  watch(child: Observee) {
    this.observees.push(child)
  }

  dispose() {
    if (!this.observees) return
    this.observees.forEach(s => s.dispose(this))
    this.observees = null
    this.value = null
    this.expr = null
    this.context = null
  }
}

export class RxImp<T, C> extends Signal<T, C> {
  private observers = new Set<Observer>()
  private observees: Array<Observee> = []
  private expr: (ctx: C) => T
  constructor(expr: (ctx: C) => T) {
    super()
    this.expr = expr
  }
  computeValue() {
    for (let sig of this.observees) {
      sig.retireFrom(this)
    }
    this.observees = []
    let ctx = this.context
    let newValue = caller.withValue(this)(this.expr.bind(ctx, ctx))
    if (this.value !== newValue) {
      this.value = newValue
      let obs = this.observers
      this.observers = new Set<any>()
      obs.forEach(o => o.computeValue())
    }
  }
  apply(): T {
    if (this.value === UNINTIALIZE) {
      this.computeValue()
      if (!inWatch) {
        let ret = this.value
        this.value = UNINTIALIZE
        return ret
      }
    }
    if (inWatch) {
      let callSig = caller.value()
      this.observers.add(callSig)
      callSig.watch(this)
    }
    return this.value
  }
  watch(child: Observee) {
    // only interior node will form cycle
    this.observees.push(child)
  }

  retireFrom(obs: Observer) {
    this.observers.delete(obs)
  }

  dispose(obs?: Observer) {
    if (obs === undefined) {
      this.observees.forEach(s => s.dispose(this))
      this.observers.forEach(o => o.dispose())
      this.observees = null
      this.observers = null
      this.value = null
      this.expr = null
      this.context = null
    } else {
      this.observers.delete(obs)
      if (this.observers.size === 0) {
        this.observees.forEach(o => o.retireFrom(this))
        this.value = UNINTIALIZE
      }
    }
  }
}

var nilSig: any = {
  watch() {}
}
var caller = new Caller<Observer>(nilSig)

export var _caller = caller


export function peek(o: Observee) {
  if (o.value !== UNINTIALIZE) return o.value
  let oldState = inWatch
  inWatch = false
  let ret = o.apply()
  inWatch = oldState
  return ret
}
