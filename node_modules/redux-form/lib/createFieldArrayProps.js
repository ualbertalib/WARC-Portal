'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var createFieldArrayProps = function createFieldArrayProps(getIn, name, _ref) {
  var arrayInsert = _ref.arrayInsert;
  var arrayMove = _ref.arrayMove;
  var arrayPop = _ref.arrayPop;
  var arrayPush = _ref.arrayPush;
  var arrayRemove = _ref.arrayRemove;
  var arrayRemoveAll = _ref.arrayRemoveAll;
  var arrayShift = _ref.arrayShift;
  var arraySplice = _ref.arraySplice;
  var arraySwap = _ref.arraySwap;
  var arrayUnshift = _ref.arrayUnshift;
  var asyncError = _ref.asyncError;
  var dirty = _ref.dirty;
  var length = _ref.length;
  var pristine = _ref.pristine;
  var submitError = _ref.submitError;
  var state = _ref.state;
  var submitFailed = _ref.submitFailed;
  var submitting = _ref.submitting;
  var syncError = _ref.syncError;
  var syncWarning = _ref.syncWarning;
  var value = _ref.value;
  var props = _ref.props;

  var rest = _objectWithoutProperties(_ref, ['arrayInsert', 'arrayMove', 'arrayPop', 'arrayPush', 'arrayRemove', 'arrayRemoveAll', 'arrayShift', 'arraySplice', 'arraySwap', 'arrayUnshift', 'asyncError', 'dirty', 'length', 'pristine', 'submitError', 'state', 'submitFailed', 'submitting', 'syncError', 'syncWarning', 'value', 'props']);

  var error = syncError || asyncError || submitError;
  var warning = syncWarning;
  return _extends({
    fields: {
      _isFieldArray: true,
      forEach: function forEach(callback) {
        return (value || []).forEach(function (item, index) {
          return callback(name + '[' + index + ']', index);
        });
      },
      insert: arrayInsert,
      length: length,
      map: function map(callback) {
        return (value || []).map(function (item, index) {
          return callback(name + '[' + index + ']', index);
        });
      },
      move: arrayMove,
      name: name,
      pop: function pop() {
        arrayPop();
        return getIn(value, length - 1);
      },
      push: arrayPush,
      reduce: function reduce(callback, initial) {
        return (value || []).reduce(function (accumulator, item, index) {
          return callback(accumulator, name + '[' + index + ']', index);
        }, initial);
      },
      remove: arrayRemove,
      removeAll: arrayRemoveAll,
      shift: function shift() {
        arrayShift();
        return getIn(value, 0);
      },
      swap: arraySwap,
      unshift: arrayUnshift
    },
    meta: {
      dirty: dirty,
      error: error,
      warning: warning,
      invalid: !!error,
      pristine: pristine,
      submitting: submitting,
      touched: !!(state && getIn(state, 'touched')),
      valid: !error
    }
  }, props, rest);
};

exports.default = createFieldArrayProps;