/// <reference path='../typings/window.d.ts' />
/// <reference path='../typings/promise.d.ts' />

// Normalize rAF
var raf: (cb) => void = window.requestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.msRequestAnimationFrame
  || function(cb) { return window.setTimeout(cb, 1000 / 60); };

enum DomOperatioType {
  READ, WRITE, PENDING
}

class DomOperation {
  id: number
  constructor(
    public fn: Function,
    public ctx: any,
    public type: DomOperatioType
  ) {
    this.id = uniqueId()
  }
}

var writeQueue: DomOperation[] = []
var readQueue: DomOperation[] = []
var mode: DomOperatioType = DomOperatioType.PENDING

// utility
var lastId = 0;
function uniqueId() {
  return lastId++;
}

var scheduled = false
function scheduleDomOperation(): void {
  if (scheduled) return
  scheduled = true
  raf(function() {
    scheduled = false
    mode = DomOperatioType.READ
    flush(readQueue)
    mode = DomOperatioType.WRITE
    flush(writeQueue)
    mode = DomOperatioType.PENDING
  })
}

function flush(queue: DomOperation[]) {
  var operation: DomOperation
  while (operation = queue.shift()) {
    let ctx = operation.ctx || this
    operation.fn.call(ctx)
  }
}

export function read(fn: Function, ctx?: any): number {
  let operation = new DomOperation(fn, ctx, DomOperatioType.READ)
  readQueue.push(operation)
  if (mode !== DomOperatioType.READ) scheduleDomOperation()
  return operation.id
}

export function write(fn: Function, ctx?: any): number {
  let operation = new DomOperation(fn, ctx, DomOperatioType.WRITE)
  writeQueue.push(operation)
  if (mode === DomOperatioType.PENDING) scheduleDomOperation()
  return operation.id
}

// sadly, TypeScript does not capture `throw` type
class FastDomPromise<Ret> {
  constructor(private promise: Promise<Ret>) {}
  then<R>(
    onFulfill: (r: Ret) => R | Promise<R>,
    onReject?: (e: any) => R | Promise<R>
  ): FastDomPromise<R> {
    let promise = this.promise.then<R>(onFulfill, onReject)
    return new FastDomPromise<R>(promise)
  }
  catch(onReject: (e: any) => Ret | Promise<Ret>): FastDomPromise<Ret> {
    let promise = this.promise.catch(onReject)
    return new FastDomPromise<Ret>(promise)
  }
  write<R>(fn: (value: Ret) => R | Promise<R>, ctx?: any): FastDomPromise<R> {
    return this.then(function(value) {
      return writePromise(function() {
        return fn.call(ctx, value)
      })
    })
  }
  read<R>(fn: (value: Ret) => R | Promise<R>, ctx?: any): FastDomPromise<R> {
    return this.then(function(value) {
      return readPromise(function() {
        return fn.call(ctx, value)
      })
    })
  }
}

var p: Promise<number> = new FastDomPromise(new Promise(() => 123))

var FastDom = {
  read<T> (fn: () => T | Promise<T>) { return new FastDomPromise(readPromise(fn)) },
  write<T>(fn: () => T | Promise<T>) { return new FastDomPromise(writePromise(fn))}
}

function readPromise<T>(fn: () => (T | Promise<T>), ctx?: any): Promise<T> {
  return new Promise(function(resolve, reject) {
    read(function() {
      try { resolve(fn.call(ctx)) }
      catch (e) { reject(e) }
    })
  })
}

function writePromise<T>(fn: () => (T | Promise<T>), ctx?: any): Promise<T> {
  return new Promise(function(resolve, reject) {
    write(function() {
      try { resolve(fn.call(ctx)) }
      catch (e) { reject(e) }
    })
  })
}

if (typeof Promise !== 'function') {
  FastDom = null;
}

export default FastDom
