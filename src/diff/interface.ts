export interface Change {
  name: string
  oldValue: any
}

export interface Diff<V> {
  oldValue: V
  insertions: Change[]
  deletions: Change[]
  substitutions: Change[]
}

export interface DiffChecker<V> {
  setValue(v: V): void
  getDiff(v: V): Diff<V>
}

