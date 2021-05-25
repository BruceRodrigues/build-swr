// `undefined` can possibly be replaced by something else.
export var UNDEFINED = {}[0];
export var isUndefined = function (v) { return v === UNDEFINED; };
