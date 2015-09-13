import {Diff, Change, DiffChecker} from './interface'

export function levenshteinDistance(newArray: any[], oldArray: any[]): number[][] {
  let row = newArray.length + 1
  let col = oldArray.length + 1
  let distances = new Array(row)

  // initialize matrix
  for (let i = 0; i < row; i++) {
    distances[i] = new Array(col)
    distances[i][0] = i
  }
  for (let j = 1; j < col; j++) {
    distances[0][j] = j
  }

  for (let i = 1; i < row; i++) {
    for (let j = 1; j < col; j++) {
      if (newArray[i-1] === oldArray[j-1]) {
        distances[i][j] = distances[i-1][j-1]
      } else {
        distances[i][j] = Math.min(
          distances[i-1][j], // deletions
          distances[i][j-1], // additions
          distances[i-1][j-1] // substitutions
        ) + 1
      }
    }
  }
  return distances
}

export class ArrayDiffChecker<V> implements DiffChecker<V[]> {
  private snapshot: V[]

  static equals<V>(v1: V[], v2: V[]): boolean {
    if (v1.length !== v2.length) return false
    for (let i = 0, l = v1.length; i < l; i++) {
      if (v1[i] !== v2[i]) return false
    }
    return true
  }

  setValue(vs: V[]): V[] {
    return this.snapshot = vs.slice()
  }

  getDiff(newArray: V[]): Diff<V[]> {
    let oldArray = this.snapshot
    let row = newArray.length, col = oldArray.length
    let changes: Change<V>[] = []
    let distances = levenshteinDistance(newArray, oldArray)
    let i = row, j = col
    while (i > 0 || j > 0) {
      if (i == 0) {
        j -= 1
        changes.push(new Change(
          'delete', i, oldArray[j]
        ))
        continue
      }
      if (j == 0) {
        i -= 1
        changes.push(new Change(
          'add', i, newArray[i]
        ))
        continue
      }
      let current = distances[i][j]
      let diag = distances[i-1][j-1]
      let left = distances[i][j-1]
      let upper = distances[i-1][j]
      let min = Math.min(diag, left, upper)
      if (min === current) {
        i -= 1
        j -= 1
        continue
      }
      if (min === left) {
        j -= 1
        changes.push(new Change(
          'delete', i, oldArray[j]
        ))
        continue
      }

      if (min === upper) {
        i -= 1
        changes.push(new Change(
          'add', i, newArray[i]
        ))
        continue
      }
      if (min === diag) {
        i -= 1
        j -= 1
        changes.push(new Change(
          'update', i, newArray[i]
        ))
      }
    }
    return {
      oldValue: oldArray,
      changes
    }
  }
}
