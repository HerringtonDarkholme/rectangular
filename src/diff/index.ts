import {Diff, Change, DiffChecker, DiffStrategy} from './interface'

const PRIMITIVES = ['undefined', 'boolean', 'number', 'string', 'symbol']

export class DefaultDiffChecker<V> implements DiffChecker<V> {
  private value: V

  static equals<V>(v1: V, v2: V): boolean {
    return v1 === v2
  }

  setValue(v: V): V {
    return this.value = v
  }

  getDiff(newV: V): Diff<V> {
    return {
      oldValue: this.value,
      changes: []
    }
  }
}

export * from './interface'
export * from './array'
export * from './object'
