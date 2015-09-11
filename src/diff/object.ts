const objectTag = '[object Object]'
const fnToString = Function.prototype.toString
const objCtorString = fnToString.call(Object)

function isObjectLike(o: any): o is Object {
  return o != null && typeof o === 'object' && !Array.isArray(o)
}

  function isHostObject(value: any) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;
    if (value != null && typeof value.toString != 'function') {
      try {
        result = !!(value + '');
      } catch(e) {}
    }
    return result;
  }

function isPlainObject(value: any) {
  if (!isObjectLike(value) || Object.prototype.toString.call(value) != objectTag || isHostObject(value)) {
    return false;
  }
  var proto = typeof value.constructor == 'function'
    ? Object.getPrototypeOf(value)
    : Object.prototype;

  if (proto === null) {
    return true;
  }
  var Ctor = proto.constructor;
  return (typeof Ctor == 'function' &&
    Ctor instanceof Ctor && Function.prototype.call(Ctor) == objCtorString);
}
