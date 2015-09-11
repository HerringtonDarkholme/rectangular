export class Change<V> {
  constructor(
    public type: string,
    public name: string | number,
    public value: V
  ) {}
}

export interface Diff<V> {
  target: V
  changes: Change<any>[]
}

export interface DiffChecker<V> {
  setValue(v: V): void
  getDiff(v: V): Diff<V>
}

