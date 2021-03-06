import {Diff, Change, DiffChecker} from './interface'

export function assign(dest: any, src: any) {
  for (let key of Object.keys(src)) {
    dest[key] = src[key]
  }
  return dest
}

export class ObjectDiffChecker<V> implements DiffChecker<V> {
  private snapshot: V

  static equals<V>(v1: V, v2: V): boolean {
    for (let key of Object.keys(v1)) {
      if (!v2.hasOwnProperty(key)) return false
    }
    for (let key of Object.keys(v2)) {
      if (!v1.hasOwnProperty(key)) return false
    }
    return true
  }

  setValue(v: V): V {
    return this.snapshot = assign({}, v)
  }

  getDiff(v: V): Diff<V> {
    let changes: Change<any>[] = []
    let oldObj: any = this.snapshot
    let newObj: any = v
    for (let key of Object.keys(newObj)) {
      if (oldObj.hasOwnProperty(key)) {
        if (oldObj[key] === newObj[key]) continue
        changes.push(new Change(
          'update', key, oldObj[key]
        ))
      } else {
        changes.push(new Change(
          'add', key, newObj[key]
        ))
      }
    }
    for (let key of Object.keys(oldObj)) {
      if (!newObj.hasOwnProperty(key)) {
        changes.push(new Change(
          'delete', key, oldObj[key]
        ))
      }
    }
    return {
      oldValue: this.snapshot,
      changes
    }
  }
}
