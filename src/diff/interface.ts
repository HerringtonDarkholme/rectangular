interface Diff<V> {
  addedFields(): any[]
  deletedFields(): any[]
  updatedFields(): any[]
}

interface DifferenceDetector {
  (newValue, oldValue): Diff<any>
}
