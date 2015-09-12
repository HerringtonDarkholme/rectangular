import {Diff, Change, DiffChecker} from './interface'

export function assign(dest: any, src: any) {
  for (let key of Object.keys(src)) {
    dest[key] = src[key]
  }
  return dest
}

export class ObjectDiffChecker<V> implements DiffChecker<V> {
  private snapshot: V
  setValue(v: V): V {
    return this.snapshot = assign({}, v)
  }

  getDiff(newObj: V): Diff<V> {
    let changes: Change<any>[] = []
    let oldObj = this.snapshot
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
