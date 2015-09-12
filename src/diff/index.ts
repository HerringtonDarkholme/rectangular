import {Diff, Change, DiffChecker} from './interface'

const PRIMITIVES = ['undefined', 'boolean', 'number', 'string', 'symbol']

class DefaultDiffChecker<V> implements DiffChecker<V> {
  private value: V

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

export var defaultDiffChecker = new DefaultDiffChecker
