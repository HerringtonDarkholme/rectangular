import {Diff, Change, DiffChecker} from './interface'

const PRIMITIVES = ['undefined', 'boolean', 'number', 'string', 'symbol']

class DefaultDiffChecker<V> implements DiffChecker<V> {
  oldValue: V

  setValue(v: V): void {
    this.oldValue = v
  }

  getDiff(v: V): Diff<V> {
    let oldV = this.oldValue
    let insertions = []
    let deletions = []
    let substitutions = []
    let objType = typeof oldV
    // different type
    // primitives
    // null
    if (objType !== typeof v ||
        PRIMITIVES.indexOf(objType) >= 0 ||
        oldV === null || v === null
       ) {
      return {
        oldValue: oldV,
        insertions,
        deletions,
        substitutions
      }
    }

    if (Array.isArray(v) && Array.isArray(oldV)) {
      return undefined // array diff
    }

    return undefined // dict diff
  }
}
