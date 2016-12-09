'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mapValues2 = require('lodash/mapValues');

var _mapValues3 = _interopRequireDefault(_mapValues2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _isPromise = require('is-promise');

var _isPromise2 = _interopRequireDefault(_isPromise);

var _getDisplayName = require('./util/getDisplayName');

var _getDisplayName2 = _interopRequireDefault(_getDisplayName);

var _actions = require('./actions');

var importedActions = _interopRequireWildcard(_actions);

var _handleSubmit = require('./handleSubmit');

var _handleSubmit2 = _interopRequireDefault(_handleSubmit);

var _silenceEvent = require('./events/silenceEvent');

var _silenceEvent2 = _interopRequireDefault(_silenceEvent);

var _silenceEvents = require('./events/silenceEvents');

var _silenceEvents2 = _interopRequireDefault(_silenceEvents);

var _asyncValidation = require('./asyncValidation');

var _asyncValidation2 = _interopRequireDefault(_asyncValidation);

var _defaultShouldAsyncValidate = require('./defaultShouldAsyncValidate');

var _defaultShouldAsyncValidate2 = _interopRequireDefault(_defaultShouldAsyncValidate);

var _plain = require('./structure/plain');

var _plain2 = _interopRequireDefault(_plain);

var _isValid = require('./selectors/isValid');

var _isValid2 = _interopRequireDefault(_isValid);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var isClassComponent = function isClassComponent(Component) {
  return Boolean(Component && Component.prototype && _typeof(Component.prototype.isReactComponent) === 'object');
};

// extract field-specific actions
var arrayInsert = importedActions.arrayInsert;
var arrayMove = importedActions.arrayMove;
var arrayPop = importedActions.arrayPop;
var arrayPush = importedActions.arrayPush;
var arrayRemove = importedActions.arrayRemove;
var arrayRemoveAll = importedActions.arrayRemoveAll;
var arrayShift = importedActions.arrayShift;
var arraySplice = importedActions.arraySplice;
var arraySwap = importedActions.arraySwap;
var arrayUnshift = importedActions.arrayUnshift;
var blur = importedActions.blur;
var change = importedActions.change;
var focus = importedActions.focus;

var formActions = _objectWithoutProperties(importedActions, ['arrayInsert', 'arrayMove', 'arrayPop', 'arrayPush', 'arrayRemove', 'arrayRemoveAll', 'arrayShift', 'arraySplice', 'arraySwap', 'arrayUnshift', 'blur', 'change', 'focus']);

var arrayActions = {
  arrayInsert: arrayInsert,
  arrayMove: arrayMove,
  arrayPop: arrayPop,
  arrayPush: arrayPush,
  arrayRemove: arrayRemove,
  arrayRemoveAll: arrayRemoveAll,
  arrayShift: arrayShift,
  arraySplice: arraySplice,
  arraySwap: arraySwap,
  arrayUnshift: arrayUnshift
};

var propsToNotUpdateFor = [].concat(_toConsumableArray(Object.keys(importedActions)), ['array', 'asyncErrors', 'initialized', 'initialValues', 'syncErrors', 'syncWarnings', 'values', 'registeredFields']);

var checkSubmit = function checkSubmit(submit) {
  if (!submit || typeof submit !== 'function') {
    throw new Error('You must either pass handleSubmit() an onSubmit function or pass onSubmit as a prop');
  }
  return submit;
};

/**
 * The decorator that is the main API to redux-form
 */
var createReduxForm = function createReduxForm(structure) {
  var deepEqual = structure.deepEqual;
  var empty = structure.empty;
  var getIn = structure.getIn;
  var setIn = structure.setIn;
  var fromJS = structure.fromJS;

  var isValid = (0, _isValid2.default)(structure);
  return function (initialConfig) {
    var config = _extends({
      touchOnBlur: true,
      touchOnChange: false,
      persistentSubmitErrors: false,
      destroyOnUnmount: true,
      shouldAsyncValidate: _defaultShouldAsyncValidate2.default,
      enableReinitialize: false,
      keepDirtyOnReinitialize: false,
      getFormState: function getFormState(state) {
        return getIn(state, 'form');
      },
      pure: true
    }, initialConfig);
    return function (WrappedComponent) {
      var Form = function (_Component) {
        _inherits(Form, _Component);

        function Form(props) {
          _classCallCheck(this, Form);

          var _this = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, props));

          _this.submit = _this.submit.bind(_this);
          _this.reset = _this.reset.bind(_this);
          _this.asyncValidate = _this.asyncValidate.bind(_this);
          _this.getValues = _this.getValues.bind(_this);
          _this.register = _this.register.bind(_this);
          _this.unregister = _this.unregister.bind(_this);
          _this.submitCompleted = _this.submitCompleted.bind(_this);
          return _this;
        }

        _createClass(Form, [{
          key: 'getChildContext',
          value: function getChildContext() {
            var _this2 = this;

            return {
              _reduxForm: _extends({}, this.props, {
                getFormState: function getFormState(state) {
                  return getIn(_this2.props.getFormState(state), _this2.props.form);
                },
                asyncValidate: this.asyncValidate,
                getValues: this.getValues,
                register: this.register,
                unregister: this.unregister
              })
            };
          }
        }, {
          key: 'initIfNeeded',
          value: function initIfNeeded(nextProps) {
            var enableReinitialize = this.props.enableReinitialize;

            if (nextProps) {
              if ((enableReinitialize || !nextProps.initialized) && !deepEqual(this.props.initialValues, nextProps.initialValues)) {
                var keepDirty = nextProps.initialized && this.props.keepDirtyOnReinitialize;
                this.props.initialize(nextProps.initialValues, keepDirty);
              }
            } else if (this.props.initialValues && (!this.props.initialized || enableReinitialize)) {
              this.props.initialize(this.props.initialValues);
            }
          }
        }, {
          key: 'updateSyncErrorsIfNeeded',
          value: function updateSyncErrorsIfNeeded(nextSyncErrors, nextError) {
            var _props = this.props;
            var error = _props.error;
            var syncErrors = _props.syncErrors;
            var updateSyncErrors = _props.updateSyncErrors;

            var noErrors = (!syncErrors || !Object.keys(syncErrors).length) && !error;
            var nextNoErrors = (!nextSyncErrors || !Object.keys(nextSyncErrors).length) && !nextError;
            if (!(noErrors && nextNoErrors) && (!_plain2.default.deepEqual(syncErrors, nextSyncErrors) || !_plain2.default.deepEqual(error, nextError))) {
              updateSyncErrors(nextSyncErrors, nextError);
            }
          }
        }, {
          key: 'validateIfNeeded',
          value: function validateIfNeeded(nextProps) {
            var _props2 = this.props;
            var validate = _props2.validate;
            var values = _props2.values;

            if (validate) {
              if (nextProps) {
                // not initial render
                if (!deepEqual(values, nextProps.values)) {
                  var _validate = validate(nextProps.values, nextProps);

                  var _error = _validate._error;

                  var nextSyncErrors = _objectWithoutProperties(_validate, ['_error']);

                  this.updateSyncErrorsIfNeeded(nextSyncErrors, _error);
                }
              } else {
                // initial render
                var _validate2 = validate(values, this.props);

                var _error2 = _validate2._error;

                var _nextSyncErrors = _objectWithoutProperties(_validate2, ['_error']);

                this.updateSyncErrorsIfNeeded(_nextSyncErrors, _error2);
              }
            }
          }
        }, {
          key: 'updateSyncWarningsIfNeeded',
          value: function updateSyncWarningsIfNeeded(nextSyncWarnings, nextWarning) {
            var _props3 = this.props;
            var warning = _props3.warning;
            var syncWarnings = _props3.syncWarnings;
            var updateSyncWarnings = _props3.updateSyncWarnings;

            var noWarnings = (!syncWarnings || !Object.keys(syncWarnings).length) && !warning;
            var nextNoWarnings = (!nextSyncWarnings || !Object.keys(nextSyncWarnings).length) && !nextWarning;
            if (!(noWarnings && nextNoWarnings) && (!_plain2.default.deepEqual(syncWarnings, nextSyncWarnings) || !_plain2.default.deepEqual(warning, nextWarning))) {
              updateSyncWarnings(nextSyncWarnings, nextWarning);
            }
          }
        }, {
          key: 'warnIfNeeded',
          value: function warnIfNeeded(nextProps) {
            var _props4 = this.props;
            var warn = _props4.warn;
            var values = _props4.values;

            if (warn) {
              if (nextProps) {
                // not initial render
                if (!deepEqual(values, nextProps.values)) {
                  var _warn = warn(nextProps.values, nextProps);

                  var _warning = _warn._warning;

                  var nextSyncWarnings = _objectWithoutProperties(_warn, ['_warning']);

                  this.updateSyncWarningsIfNeeded(nextSyncWarnings, _warning);
                }
              } else {
                // initial render
                var _warn2 = warn(values, this.props);

                var _warning2 = _warn2._warning;

                var _nextSyncWarnings = _objectWithoutProperties(_warn2, ['_warning']);

                this.updateSyncWarningsIfNeeded(_nextSyncWarnings, _warning2);
              }
            }
          }
        }, {
          key: 'componentWillMount',
          value: function componentWillMount() {
            this.initIfNeeded();
            this.validateIfNeeded();
            this.warnIfNeeded();
          }
        }, {
          key: 'componentWillReceiveProps',
          value: function componentWillReceiveProps(nextProps) {
            this.initIfNeeded(nextProps);
            this.validateIfNeeded(nextProps);
            this.warnIfNeeded(nextProps);
          }
        }, {
          key: 'shouldComponentUpdate',
          value: function shouldComponentUpdate(nextProps) {
            var _this3 = this;

            if (!config.pure) return true;
            return Object.keys(nextProps).some(function (prop) {
              // useful to debug rerenders
              // if (!plain.deepEqual(this.props[ prop ], nextProps[ prop ])) {
              //   console.info(prop, 'changed', this.props[ prop ], '==>', nextProps[ prop ])
              // }
              return !~propsToNotUpdateFor.indexOf(prop) && !deepEqual(_this3.props[prop], nextProps[prop]);
            });
          }
        }, {
          key: 'componentWillUnmount',
          value: function componentWillUnmount() {
            var _props5 = this.props;
            var destroyOnUnmount = _props5.destroyOnUnmount;
            var destroy = _props5.destroy;

            if (destroyOnUnmount) {
              this.destroyed = true;
              destroy();
            }
          }
        }, {
          key: 'getValues',
          value: function getValues() {
            return this.props.values;
          }
        }, {
          key: 'isValid',
          value: function isValid() {
            return this.props.valid;
          }
        }, {
          key: 'isPristine',
          value: function isPristine() {
            return this.props.pristine;
          }
        }, {
          key: 'register',
          value: function register(name, type) {
            this.props.registerField(name, type);
          }
        }, {
          key: 'unregister',
          value: function unregister(name) {
            if (!this.destroyed) {
              this.props.unregisterField(name);
            }
          }
        }, {
          key: 'getFieldList',
          value: function getFieldList() {
            return this.props.registeredFields.map(function (field) {
              return getIn(field, 'name');
            });
          }
        }, {
          key: 'asyncValidate',
          value: function asyncValidate(name, value) {
            var _this4 = this;

            var _props6 = this.props;
            var asyncBlurFields = _props6.asyncBlurFields;
            var asyncErrors = _props6.asyncErrors;
            var asyncValidate = _props6.asyncValidate;
            var dispatch = _props6.dispatch;
            var initialized = _props6.initialized;
            var pristine = _props6.pristine;
            var shouldAsyncValidate = _props6.shouldAsyncValidate;
            var startAsyncValidation = _props6.startAsyncValidation;
            var stopAsyncValidation = _props6.stopAsyncValidation;
            var syncErrors = _props6.syncErrors;
            var values = _props6.values;

            var submitting = !name;
            if (asyncValidate) {
              var _ret = function () {
                var valuesToValidate = submitting ? values : setIn(values, name, value);
                var syncValidationPasses = submitting || !getIn(syncErrors, name);
                var isBlurredField = !submitting && (!asyncBlurFields || ~asyncBlurFields.indexOf(name.replace(/\[[0-9]+\]/g, '[]')));
                if ((isBlurredField || submitting) && shouldAsyncValidate({
                  asyncErrors: asyncErrors,
                  initialized: initialized,
                  trigger: submitting ? 'submit' : 'blur',
                  blurredField: name,
                  pristine: pristine,
                  syncValidationPasses: syncValidationPasses
                })) {
                  return {
                    v: (0, _asyncValidation2.default)(function () {
                      return asyncValidate(valuesToValidate, dispatch, _this4.props, name);
                    }, startAsyncValidation, stopAsyncValidation, name)
                  };
                }
              }();

              if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
            }
          }
        }, {
          key: 'submitCompleted',
          value: function submitCompleted(result) {
            delete this.submitPromise;
            return result;
          }
        }, {
          key: 'listenToSubmit',
          value: function listenToSubmit(promise) {
            if (!(0, _isPromise2.default)(promise)) {
              return promise;
            }
            this.submitPromise = promise;
            return promise.then(this.submitCompleted);
          }
        }, {
          key: 'submit',
          value: function submit(submitOrEvent) {
            var _this5 = this;

            var onSubmit = this.props.onSubmit;


            if (!submitOrEvent || (0, _silenceEvent2.default)(submitOrEvent)) {
              // submitOrEvent is an event: fire submit if not already submitting
              if (!this.submitPromise) {
                return this.listenToSubmit((0, _handleSubmit2.default)(checkSubmit(onSubmit), this.props, this.isValid(), this.asyncValidate, this.getFieldList()));
              }
            } else {
              // submitOrEvent is the submit function: return deferred submit thunk
              return (0, _silenceEvents2.default)(function () {
                return !_this5.submitPromise && _this5.listenToSubmit((0, _handleSubmit2.default)(checkSubmit(submitOrEvent), _this5.props, _this5.isValid(), _this5.asyncValidate, _this5.getFieldList()));
              });
            }
          }
        }, {
          key: 'reset',
          value: function reset() {
            this.props.reset();
          }
        }, {
          key: 'render',
          value: function render() {
            // remove some redux-form config-only props
            /* eslint-disable no-unused-vars */
            var _props7 = this.props;
            var anyTouched = _props7.anyTouched;
            var arrayInsert = _props7.arrayInsert;
            var arrayMove = _props7.arrayMove;
            var arrayPop = _props7.arrayPop;
            var arrayPush = _props7.arrayPush;
            var arrayRemove = _props7.arrayRemove;
            var arrayRemoveAll = _props7.arrayRemoveAll;
            var arrayShift = _props7.arrayShift;
            var arraySplice = _props7.arraySplice;
            var arraySwap = _props7.arraySwap;
            var arrayUnshift = _props7.arrayUnshift;
            var asyncErrors = _props7.asyncErrors;
            var asyncValidate = _props7.asyncValidate;
            var asyncValidating = _props7.asyncValidating;
            var blur = _props7.blur;
            var change = _props7.change;
            var destroy = _props7.destroy;
            var destroyOnUnmount = _props7.destroyOnUnmount;
            var dirty = _props7.dirty;
            var dispatch = _props7.dispatch;
            var enableReinitialize = _props7.enableReinitialize;
            var error = _props7.error;
            var focus = _props7.focus;
            var form = _props7.form;
            var getFormState = _props7.getFormState;
            var initialize = _props7.initialize;
            var initialized = _props7.initialized;
            var initialValues = _props7.initialValues;
            var invalid = _props7.invalid;
            var keepDirtyOnReinitialize = _props7.keepDirtyOnReinitialize;
            var pristine = _props7.pristine;
            var propNamespace = _props7.propNamespace;
            var registeredFields = _props7.registeredFields;
            var registerField = _props7.registerField;
            var reset = _props7.reset;
            var setSubmitFailed = _props7.setSubmitFailed;
            var setSubmitSucceeded = _props7.setSubmitSucceeded;
            var shouldAsyncValidate = _props7.shouldAsyncValidate;
            var startAsyncValidation = _props7.startAsyncValidation;
            var startSubmit = _props7.startSubmit;
            var stopAsyncValidation = _props7.stopAsyncValidation;
            var stopSubmit = _props7.stopSubmit;
            var submitting = _props7.submitting;
            var submitFailed = _props7.submitFailed;
            var submitSucceeded = _props7.submitSucceeded;
            var touch = _props7.touch;
            var touchOnBlur = _props7.touchOnBlur;
            var touchOnChange = _props7.touchOnChange;
            var persistentSubmitErrors = _props7.persistentSubmitErrors;
            var syncErrors = _props7.syncErrors;
            var syncWarnings = _props7.syncWarnings;
            var unregisterField = _props7.unregisterField;
            var untouch = _props7.untouch;
            var updateSyncErrors = _props7.updateSyncErrors;
            var updateSyncWarnings = _props7.updateSyncWarnings;
            var valid = _props7.valid;
            var values = _props7.values;
            var warning = _props7.warning;

            var rest = _objectWithoutProperties(_props7, ['anyTouched', 'arrayInsert', 'arrayMove', 'arrayPop', 'arrayPush', 'arrayRemove', 'arrayRemoveAll', 'arrayShift', 'arraySplice', 'arraySwap', 'arrayUnshift', 'asyncErrors', 'asyncValidate', 'asyncValidating', 'blur', 'change', 'destroy', 'destroyOnUnmount', 'dirty', 'dispatch', 'enableReinitialize', 'error', 'focus', 'form', 'getFormState', 'initialize', 'initialized', 'initialValues', 'invalid', 'keepDirtyOnReinitialize', 'pristine', 'propNamespace', 'registeredFields', 'registerField', 'reset', 'setSubmitFailed', 'setSubmitSucceeded', 'shouldAsyncValidate', 'startAsyncValidation', 'startSubmit', 'stopAsyncValidation', 'stopSubmit', 'submitting', 'submitFailed', 'submitSucceeded', 'touch', 'touchOnBlur', 'touchOnChange', 'persistentSubmitErrors', 'syncErrors', 'syncWarnings', 'unregisterField', 'untouch', 'updateSyncErrors', 'updateSyncWarnings', 'valid', 'values', 'warning']);
            /* eslint-enable no-unused-vars */


            var reduxFormProps = _extends({
              anyTouched: anyTouched,
              asyncValidate: this.asyncValidate,
              asyncValidating: asyncValidating
            }, (0, _redux.bindActionCreators)({ blur: blur, change: change }, dispatch), {
              destroy: destroy,
              dirty: dirty,
              dispatch: dispatch,
              error: error,
              form: form,
              handleSubmit: this.submit,
              initialize: initialize,
              initialized: initialized,
              initialValues: initialValues,
              invalid: invalid,
              pristine: pristine,
              reset: reset,
              submitting: submitting,
              submitFailed: submitFailed,
              submitSucceeded: submitSucceeded,
              touch: touch,
              untouch: untouch,
              valid: valid,
              warning: warning
            });
            var propsToPass = _extends({}, propNamespace ? _defineProperty({}, propNamespace, reduxFormProps) : reduxFormProps, rest);
            if (isClassComponent(WrappedComponent)) {
              propsToPass.ref = 'wrapped';
            }
            return (0, _react.createElement)(WrappedComponent, propsToPass);
          }
        }]);

        return Form;
      }(_react.Component);

      Form.displayName = 'Form(' + (0, _getDisplayName2.default)(WrappedComponent) + ')';
      Form.WrappedComponent = WrappedComponent;
      Form.childContextTypes = {
        _reduxForm: _react.PropTypes.object.isRequired
      };
      Form.propTypes = {
        destroyOnUnmount: _react.PropTypes.bool,
        form: _react.PropTypes.string.isRequired,
        initialValues: _react.PropTypes.object,
        getFormState: _react.PropTypes.func,
        onSubmitFail: _react.PropTypes.func,
        onSubmitSuccess: _react.PropTypes.func,
        propNameSpace: _react.PropTypes.string,
        validate: _react.PropTypes.func,
        warn: _react.PropTypes.func,
        touchOnBlur: _react.PropTypes.bool,
        touchOnChange: _react.PropTypes.bool,
        persistentSubmitErrors: _react.PropTypes.bool,
        registeredFields: _react.PropTypes.any
      };

      var connector = (0, _reactRedux.connect)(function (state, props) {
        var form = props.form;
        var getFormState = props.getFormState;
        var initialValues = props.initialValues;

        var formState = getIn(getFormState(state) || empty, form) || empty;
        var stateInitial = getIn(formState, 'initial');
        var initial = initialValues || stateInitial || empty;
        var values = getIn(formState, 'values') || initial;
        var pristine = deepEqual(initial, values);
        var asyncErrors = getIn(formState, 'asyncErrors');
        var syncErrors = getIn(formState, 'syncErrors') || {};
        var syncWarnings = getIn(formState, 'syncWarnings') || {};
        var registeredFields = getIn(formState, 'registeredFields') || [];
        var valid = isValid(form, getFormState)(state);
        var anyTouched = !!getIn(formState, 'anyTouched');
        var submitting = !!getIn(formState, 'submitting');
        var submitFailed = !!getIn(formState, 'submitFailed');
        var submitSucceeded = !!getIn(formState, 'submitSucceeded');
        var error = getIn(formState, 'error');
        var warning = getIn(formState, 'warning');
        return {
          anyTouched: anyTouched,
          asyncErrors: asyncErrors,
          asyncValidating: getIn(formState, 'asyncValidating') || false,
          dirty: !pristine,
          error: error,
          initialized: !!stateInitial,
          invalid: !valid,
          pristine: pristine,
          registeredFields: registeredFields,
          submitting: submitting,
          submitFailed: submitFailed,
          submitSucceeded: submitSucceeded,
          syncErrors: syncErrors,
          syncWarnings: syncWarnings,
          values: values,
          valid: valid,
          warning: warning
        };
      }, function (dispatch, initialProps) {
        var bindForm = function bindForm(actionCreator) {
          return actionCreator.bind(null, initialProps.form);
        };

        // Bind the first parameter on `props.form`
        var boundFormACs = (0, _mapValues3.default)(formActions, bindForm);
        var boundArrayACs = (0, _mapValues3.default)(arrayActions, bindForm);
        var boundBlur = function boundBlur(field, value) {
          return blur(initialProps.form, field, value, !!initialProps.touchOnBlur);
        };
        var boundChange = function boundChange(field, value) {
          return change(initialProps.form, field, value, !!initialProps.touchOnChange, !!initialProps.persistentSubmitErrors);
        };
        var boundFocus = bindForm(focus);

        // Wrap action creators with `dispatch`
        var connectedFormACs = (0, _redux.bindActionCreators)(boundFormACs, dispatch);
        var connectedArrayACs = {
          insert: (0, _redux.bindActionCreators)(boundArrayACs.arrayInsert, dispatch),
          move: (0, _redux.bindActionCreators)(boundArrayACs.arrayMove, dispatch),
          pop: (0, _redux.bindActionCreators)(boundArrayACs.arrayPop, dispatch),
          push: (0, _redux.bindActionCreators)(boundArrayACs.arrayPush, dispatch),
          remove: (0, _redux.bindActionCreators)(boundArrayACs.arrayRemove, dispatch),
          removeAll: (0, _redux.bindActionCreators)(boundArrayACs.arrayRemoveAll, dispatch),
          shift: (0, _redux.bindActionCreators)(boundArrayACs.arrayShift, dispatch),
          splice: (0, _redux.bindActionCreators)(boundArrayACs.arraySplice, dispatch),
          swap: (0, _redux.bindActionCreators)(boundArrayACs.arraySwap, dispatch),
          unshift: (0, _redux.bindActionCreators)(boundArrayACs.arrayUnshift, dispatch)
        };

        var computedActions = _extends({}, connectedFormACs, boundArrayACs, {
          blur: boundBlur,
          change: boundChange,
          array: connectedArrayACs,
          focus: boundFocus,
          dispatch: dispatch
        });

        return function () {
          return computedActions;
        };
      }, undefined, { withRef: true });
      var ConnectedForm = (0, _hoistNonReactStatics2.default)(connector(Form), WrappedComponent);
      ConnectedForm.defaultProps = config;

      // build outer component to expose instance api
      return function (_Component2) {
        _inherits(ReduxForm, _Component2);

        function ReduxForm() {
          _classCallCheck(this, ReduxForm);

          return _possibleConstructorReturn(this, (ReduxForm.__proto__ || Object.getPrototypeOf(ReduxForm)).apply(this, arguments));
        }

        _createClass(ReduxForm, [{
          key: 'submit',
          value: function submit() {
            return this.refs.wrapped.getWrappedInstance().submit();
          }
        }, {
          key: 'reset',
          value: function reset() {
            return this.refs.wrapped.getWrappedInstance().reset();
          }
        }, {
          key: 'render',
          value: function render() {
            var _props8 = this.props;
            var initialValues = _props8.initialValues;

            var rest = _objectWithoutProperties(_props8, ['initialValues']);

            return (0, _react.createElement)(ConnectedForm, _extends({}, rest, {
              ref: 'wrapped',
              // convert initialValues if need to
              initialValues: fromJS(initialValues)
            }));
          }
        }, {
          key: 'valid',
          get: function get() {
            return this.refs.wrapped.getWrappedInstance().isValid();
          }
        }, {
          key: 'invalid',
          get: function get() {
            return !this.valid;
          }
        }, {
          key: 'pristine',
          get: function get() {
            return this.refs.wrapped.getWrappedInstance().isPristine();
          }
        }, {
          key: 'dirty',
          get: function get() {
            return !this.pristine;
          }
        }, {
          key: 'values',
          get: function get() {
            return this.refs.wrapped.getWrappedInstance().getValues();
          }
        }, {
          key: 'fieldList',
          get: function get() {
            // mainly provided for testing
            return this.refs.wrapped.getWrappedInstance().getFieldList();
          }
        }, {
          key: 'wrappedInstance',
          get: function get() {
            // for testine
            return this.refs.wrapped.getWrappedInstance().refs.wrapped;
          }
        }]);

        return ReduxForm;
      }(_react.Component);
    };
  };
};

exports.default = createReduxForm;