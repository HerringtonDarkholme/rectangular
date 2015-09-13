export class Change<V> {
  constructor(
    public type: string,
    public name: string | number,
    public value: V
  ) {}
}

export interface Diff<V> {
  oldValue: V
  changes: Change<any>[]
}

export interface DiffChecker<V> {
  setValue(v: V): void
  getDiff(v: V): Diff<V>
}

export interface DiffStrategy {
  new<V>(): DiffChecker<V>
  equals<V>(v1: V, v2: V): boolean
}
