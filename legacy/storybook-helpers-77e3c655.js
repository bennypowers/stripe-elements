System.register(['./lit-html-d4bb504d.js', './lit-element-ba2ebbe8.js'], function (exports) {
  'use strict';
  var _inherits, _classCallCheck, _possibleConstructorReturn, _getPrototypeOf$1, _createClass, _get$1, _slicedToArray, _wrapNativeSuper, _taggedTemplateLiteral, render, _typeof, html, ifDefined, _toConsumableArray, _objectSpread2, _assertThisInitialized, _asyncToGenerator, _defineProperty$1, css$1, _toArray, property, _defineProperty, LitElement;
  return {
    setters: [function (module) {
      _inherits = module.a;
      _classCallCheck = module.d;
      _possibleConstructorReturn = module.e;
      _getPrototypeOf$1 = module.f;
      _createClass = module.b;
      _get$1 = module.i;
      _slicedToArray = module.n;
      _wrapNativeSuper = module.c;
      _taggedTemplateLiteral = module.k;
      render = module.r;
      _typeof = module.g;
      html = module.l;
      ifDefined = module.o;
      _toConsumableArray = module.h;
      _objectSpread2 = module.p;
      _assertThisInitialized = module.m;
      _asyncToGenerator = module._;
      _defineProperty$1 = module.q;
    }, function (module) {
      css$1 = module.c;
      _toArray = module._;
      property = module.p;
      _defineProperty = module.b;
      LitElement = module.L;
    }],
    execute: function () {

      exports({
        _: _get,
        a: _getPrototypeOf,
        b: bound
      });

      function _getPrototypeOf(o) {
        _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
        };
        return _getPrototypeOf(o);
      }

      function _superPropBase(object, property) {
        while (!Object.prototype.hasOwnProperty.call(object, property)) {
          object = _getPrototypeOf(object);
          if (object === null) break;
        }

        return object;
      }

      function _get(target, property, receiver) {
        if (typeof Reflect !== "undefined" && Reflect.get) {
          _get = Reflect.get;
        } else {
          _get = function _get(target, property, receiver) {
            var base = _superPropBase(target, property);
            if (!base) return;
            var desc = Object.getOwnPropertyDescriptor(base, property);

            if (desc.get) {
              return desc.get.call(receiver);
            }

            return desc.value;
          };
        }

        return _get(target, property, receiver || target);
      }

      /** @typedef {import('lit-element').PropertyDeclaration & { notify: string|Boolean }} AugmentedPropertyDeclaration */

      /**
       * @template TBase
       * @typedef {new (...args: any[]) => import('lit-element').LitElement & TBase} Constructor
       */

      /**
       * Returns the event name for the given property.
       * @param  {string}                       name    property name
       * @param  {AugmentedPropertyDeclaration} options property declaration
       * @return                                event name to fire
       */
      function eventNameForProperty(name) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (options.notify && typeof options.notify === 'string') {
          return options.notify;
        }

        if (options.attribute && typeof options.attribute === 'string') {
          return "".concat(options.attribute, "-changed");
        }

        return "".concat(name.toLowerCase(), "-changed");
      } // eslint-disable-next-line valid-jsdoc

      /**
       * Enables the nofity option for properties to fire change notification events
       *
       * @template TBase
       * @param {Constructor<TBase>} baseElement
       */

      var LitNotify = exports('L', function LitNotify(baseElement) {
        return (
          /*#__PURE__*/
          function (_baseElement) {
            _inherits(NotifyingElement, _baseElement);

            function NotifyingElement() {
              _classCallCheck(this, NotifyingElement);

              return _possibleConstructorReturn(this, _getPrototypeOf$1(NotifyingElement).apply(this, arguments));
            }

            _createClass(NotifyingElement, [{
              key: "update",

              /**
               * check for changed properties with notify option and fire the events
               */
              value: function update(changedProps) {
                _get$1(_getPrototypeOf$1(NotifyingElement.prototype), "update", this).call(this, changedProps);

                if (!this.constructor._propertyEventMap) {
                  return;
                }

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                  for (var _iterator = this.constructor._propertyEventMap.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = _slicedToArray(_step.value, 2),
                        eventProp = _step$value[0],
                        eventName = _step$value[1];

                    if (changedProps.has(eventProp)) {
                      this.dispatchEvent(new CustomEvent(eventName, {
                        detail: {
                          value: this[eventProp]
                        },
                        bubbles: true,
                        composed: false
                      }));
                    }
                  }
                } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                      _iterator.return();
                    }
                  } finally {
                    if (_didIteratorError) {
                      throw _iteratorError;
                    }
                  }
                }
              }
            }], [{
              key: "createProperty",

              /**
               * Extend the LitElement `createProperty` method to map properties to events
               */
              value: function createProperty(name, options) {
                _get$1(_getPrototypeOf$1(NotifyingElement), "createProperty", this).call(this, name, options);

                if (!this._propertyEventMap) {
                  this._propertyEventMap = new Map();
                }

                if (options.notify) {
                  this._propertyEventMap.set(name, eventNameForProperty(name, options));
                }
              }
            }]);

            return NotifyingElement;
          }(baseElement)
        );
      });

      function curry1(fn) {
        function curried(a) {
          switch (arguments.length) {
            case 0:
              return curried;

            default:
              return fn(a);
          }
        }

        return curried;
      }

      function curry2(fn) {
        function curried(a, b) {
          switch (arguments.length) {
            case 0:
              return curried;

            case 1:
              return curry1(function (b) {
                return fn(a, b);
              });

            default:
              return fn(a, b);
          }
        }

        return curried;
      }

      function curry3(fn) {
        function curried(a, b, c) {
          switch (arguments.length) {
            case 0:
              return curried;

            case 1:
              return curry2(function (b, c) {
                return fn(a, b, c);
              });

            case 2:
              return curry1(function (c) {
                return fn(a, b, c);
              });

            default:
              return fn(a, b, c);
          }
        }

        return curried;
      }

      function curry4(fn) {
        function curried(a, b, c, d) {
          switch (arguments.length) {
            case 0:
              return curried;

            case 1:
              return curry3(function (b, c, d) {
                return fn(a, b, c, d);
              });

            case 2:
              return curry2(function (c, d) {
                return fn(a, b, c, d);
              });

            case 3:
              return curry1(function (d) {
                return fn(a, b, c, d);
              });

            default:
              return fn(a, b, c, d);
          }
        }

        return curried;
      }

      function curry5(fn) {
        function curried(a, b, c, d, e) {
          switch (arguments.length) {
            case 0:
              return curried;

            case 1:
              return curry4(function (b, c, d, e) {
                return fn(a, b, c, d, e);
              });

            case 2:
              return curry3(function (c, d, e) {
                return fn(a, b, c, d, e);
              });

            case 3:
              return curry2(function (d, e) {
                return fn(a, b, c, d, e);
              });

            case 4:
              return curry1(function (e) {
                return fn(a, b, c, d, e);
              });

            default:
              return fn(a, b, c, d, e);
          }
        }

        return curried;
      }

      function curry(fn) {
        switch (fn.length) {
          case 0:
            return fn;

          case 1:
            return curry1(fn);

          case 2:
            return curry2(fn);

          case 3:
            return curry3(fn);

          case 4:
            return curry4(fn);

          case 5:
            return curry5(fn);

          default:
            throw new Error("Its highly suggested that you do not write functions with more than 5 parameters.");
        }
      }

      var allCapitalLetterGroups = /[A-ZÀ-ÖÙ-Ý]+/g;
      var allLowercaseWords = /[a-zà-öù-ý]+/g;
      /**
       *	Converts a string value into [kebab case](https://en.wikipedia.org/wiki/Kebab_case).
       * @param value The string to convert.
       * @category String
       * @returns The kebab-cased string.
       * @example
      kebabCase('fooBARBaz')
      // => 'foo-bar-baz'
       */

      function kebabCase(value) {
        var words = value.replace(allCapitalLetterGroups, brokenLowered).match(allLowercaseWords);
        return words ? words.join('-') : '';

        function brokenLowered(s) {
          return ' ' + (s.length > 2 ? s.slice(0, -1) + ' ' + s.slice(-1) : s).toLowerCase();
        }
      }

      var allCapitalLetterGroups$1 = /[A-ZÀ-ÖÙ-Ý]+/g;
      var allWords = /[A-ZÀ-ÖÙ-Ýa-zà-öù-ý]+/g;
      /**
       *	Converts a string value into [camel case](https://en.wikipedia.org/wiki/Camel_case).
       * @param value The string to convert.
       * @category String
       * @returns The camel-cased string.
       * @example
      camelCase('foo-bar-baz')
      // => 'fooBarBaz'
       */

      function camelCase(value) {
        var words = value.replace(allCapitalLetterGroups$1, valleyCase).match(allWords);
        return words ? words[0][0].toLowerCase() + words.map(function (x) {
          return x[0].toUpperCase() + x.slice(1);
        }).join('').slice(1) : '';

        function valleyCase(s) {
          return s.length > 2 ? s[0] + s.slice(1, -1).toLowerCase() + s.slice(-1) : s;
        }
      }

      function createCache() {
        var cache = {};
        return {
          has: function has(key) {
            return Object.hasOwnProperty.call(cache, key);
          },
          get: function get(key) {
            return cache[key];
          },
          set: function set(key, value) {
            cache[key] = value;
          }
        };
      }

      function memoize(cacheKeyFn, fn) {
        var cache = createCache();
        return function () {
          var key = cacheKeyFn.apply(void 0, arguments);

          if (!cache.has(key)) {
            cache.set(key, fn.apply(void 0, arguments));
          }

          return cache.get(key);
        };
      }

      function _templateObject4() {
        var data = _taggedTemplateLiteral(["[hidden]{display:none!important}:host{display:block;box-sizing:border-box}#error{font-family:sans-serif;font-size:14px;padding-left:42px;padding-bottom:10px}"]);

        _templateObject4 = function _templateObject4() {
          return data;
        };

        return data;
      }

      function _templateObject3() {
        var data = _taggedTemplateLiteral([" <div id=\"stripe\" part=\"stripe\"> <slot id=\"stripe-slot\" name=\"", "\"></slot> </div> <output id=\"error\" for=\"stripe\" part=\"error\" ?hidden=\"", "\"> ", " </output> "]);

        _templateObject3 = function _templateObject3() {
          return data;
        };

        return data;
      }

      function _templateObject2() {
        var data = _taggedTemplateLiteral(["<div id=\"", "\" class=\"", "-mount\"></div>"]);

        _templateObject2 = function _templateObject2() {
          return data;
        };

        return data;
      }

      function _templateObject() {
        var data = _taggedTemplateLiteral(["<slot slot=\"", "\" name=\"", "\"></slot>"]);

        _templateObject = function _templateObject() {
          return data;
        };

        return data;
      }

      function bound(elementDescriptor) {
        var kind = elementDescriptor.kind,
            key = elementDescriptor.key,
            descriptor = elementDescriptor.descriptor;

        if (kind !== 'method') {
          throw Error('@bound decorator can only be used on methods');
        }

        var method = descriptor.value;
        var initializer = // check for private method
        _typeof(key) === 'object' ? function () {
          return method.bind(this);
        } : // For public and symbol-keyed methods (which are technically public),
        // we defer method lookup until construction to respect the prototype chain.
        function () {
          return this[key].bind(this);
        }; // Return both the original method and a bound function field that calls the method.
        // (That way the original method will still exist on the prototype, avoiding
        // confusing side-effects.)

        elementDescriptor.extras = [{
          kind: 'field',
          key: key,
          placement: 'own',
          initializer: initializer,
          descriptor: _objectSpread2({}, descriptor, {
            value: undefined
          })
        }];
        return elementDescriptor;
      }
      /** @typedef {import('lit-element').PropertyDeclaration & { readOnly: Boolean }} AugmentedPropertyDeclaration */

      /**
       * @template TBase
       * @typedef {new (...args: any[]) => import('lit-element').LitElement & TBase} Constructor
       */
      // eslint-disable-next-line valid-jsdoc

      /**
       * Enables the nofity option for properties to fire change notification events
       *
       * @template TBase
       * @param {Constructor<TBase>} superclass
       */


      var ReadOnlyPropertiesMixin = function ReadOnlyPropertiesMixin(superclass) {
        var _temp;
        /**
         * @type {Map<string, symbol>}
         * @private
         */


        var _readOnlyPropertyNamesMap = new Map();

        return _temp =
        /*#__PURE__*/
        function (_superclass) {
          _inherits(ReadOnlyPropertiesClass, _superclass);

          _createClass(ReadOnlyPropertiesClass, null, [{
            key: "createProperty",

            /**
             * @inheritdoc
             * @param  {string} name property name
             * @param  {AugmentedPropertyDeclaration} options augmented property declaration with optional `readOnly` boolean.
             */
            value: function createProperty(name, options) {
              var finalOptions = options;

              if (options.readOnly) {
                var privateName = Symbol(name);

                _readOnlyPropertyNamesMap.set(name, privateName);

                Object.defineProperty(this.prototype, name, {
                  get: function get() {
                    return this[privateName];
                  },
                  set: function set(value) {
                    // allow for class field initialization

                    /* istanbul ignore if */
                    if (this._readOnlyPropertyInitializedMap.get(name)) return;
                    this[privateName] = value;

                    this._readOnlyPropertyInitializedMap.set(name, true);
                  }
                });
                finalOptions = _objectSpread2({}, options, {
                  noAccessor: true
                });
              }

              _get$1(_getPrototypeOf$1(ReadOnlyPropertiesClass), "createProperty", this).call(this, name, finalOptions);
            }
            /**
             * @type {Map<string, boolean>}
             * @private
             */

          }]);

          function ReadOnlyPropertiesClass() {
            var _this;

            _classCallCheck(this, ReadOnlyPropertiesClass);

            _this = _possibleConstructorReturn(this, _getPrototypeOf$1(ReadOnlyPropertiesClass).call(this));

            _defineProperty(_assertThisInitialized(_this), "_readOnlyPropertyInitializedMap", new Map());

            _this._setPropEntry = _this._setPropEntry.bind(_assertThisInitialized(_this));
            return _this;
          }
          /**
           * Set read-only properties
           * @param  {Object<string, unknown>}  props
           * @private
           */


          _createClass(ReadOnlyPropertiesClass, [{
            key: "set",
            value: function () {
              var _set = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee(props) {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return Promise.all(Object.entries(props).map(this._setPropEntry));

                      case 2:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              }));

              function set(_x) {
                return _set.apply(this, arguments);
              }

              return set;
            }()
            /**
             * @param {[string, unknown]} entry
             * @return {Promise<unknown>}
             * @private
             */

          }, {
            key: "_setPropEntry",
            value: function _setPropEntry(_ref) {
              var _ref2 = _slicedToArray(_ref, 2),
                  name = _ref2[0],
                  newVal = _ref2[1];

              // typescript... https://github.com/microsoft/TypeScript/issues/1863

              /** @type {any} */
              var privateName = _readOnlyPropertyNamesMap.get(name);

              var oldVal = this[privateName];
              this[privateName] = newVal;
              return this.requestUpdate(name, oldVal);
            }
          }]);

          return ReadOnlyPropertiesClass;
        }(superclass), _temp;
      };
      /**
       * Remove an element from the DOM
       * @param {ChildNode} el
       * @return {void}
       */

      /* istanbul ignore next */


      var remove = function remove(el) {
        return el === null || el === void 0 ? void 0 : el.remove();
      };

      var appendTemplate = curry(function appendTemplate(template, target) {
        var tmp = document.createElement('div');
        render(template, tmp);
        var firstElementChild = tmp.firstElementChild;
        target.appendChild(firstElementChild);
        tmp.remove();
        return firstElementChild;
      });

      var mapPropEntry = function mapPropEntry(mapping) {
        return function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
              key = _ref4[0],
              value = _ref4[1];

          return key in mapping && typeof mapping[key] === 'function' ? [key, mapping[key](value)] : [key, value];
        };
      };

      var mapProps = exports('f', function mapProps(mapping) {
        return function (obj) {
          return Object.fromEntries(Object.entries(obj).map(mapPropEntry(mapping)));
        };
      });

      var mapDataset = exports('m', function mapDataset(f) {
        return function (_ref5) {
          var dataset = _ref5.dataset;
          return f(dataset);
        };
      });

      var identity = function identity(x) {
        return x;
      };
      /** camelCase a string */


      var camel = exports('e', memoize(identity, camelCase));
      /** dash-case a string */

      var dash = exports('d', memoize(identity, kebabCase));
      /**
       * Generates a random mount point for Stripe Elements. This will allow multiple
       * Elements forms to be embedded on a single page.
       * @param {'STRIPE-ELEMENTS'|'STRIPE-PAYMENT-REQUEST'} tagName element tag name
       * @return {string} mount element id
       */

      function generateRandomMountElementId(tagName) {
        return "".concat(tagName.toLowerCase(), "-mount-point-").concat((Date.now() + Math.random() * 1000).toString(36).substr(0, 8));
      }

      var elem = function elem(xs) {
        return function (x) {
          return xs.includes(x);
        };
      };

      var isRepresentation = elem(['paymentMethod', 'source', 'token']);
      /**
       * Throws an error if the response is not OK.)
       * @param  {Response} response
       * @resolves {Response}
       * @rejects {Error}
       */

      function throwBadResponse(_x2) {
        return _throwBadResponse.apply(this, arguments);
      }

      function _throwBadResponse() {
        _throwBadResponse = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee11(response) {
          var ok, statusText;
          return regeneratorRuntime.wrap(function _callee11$(_context11) {
            while (1) {
              switch (_context11.prev = _context11.next) {
                case 0:
                  ok = response.ok, statusText = response.statusText;

                  if (ok) {
                    _context11.next = 3;
                    break;
                  }

                  throw new Error(statusText);

                case 3:
                  return _context11.abrupt("return", response);

                case 4:
                case "end":
                  return _context11.stop();
              }
            }
          }, _callee11);
        }));
        return _throwBadResponse.apply(this, arguments);
      }

      function _decorate(decorators, factory, superClass, mixins) {
        var api = _getDecoratorsApi();

        if (mixins) {
          for (var i = 0; i < mixins.length; i++) {
            api = mixins[i](api);
          }
        }

        var r = factory(function initialize(O) {
          api.initializeInstanceElements(O, decorated.elements);
        }, superClass);
        var decorated = api.decorateClass(_coalesceClassElements(r.d.map(_createElementDescriptor)), decorators);
        api.initializeClassElements(r.F, decorated.elements);
        return api.runClassFinishers(r.F, decorated.finishers);
      }

      function _getDecoratorsApi() {
        _getDecoratorsApi = function _getDecoratorsApi() {
          return api;
        };

        var api = {
          elementsDefinitionOrder: [["method"], ["field"]],
          initializeInstanceElements: function initializeInstanceElements(O, elements) {
            ["method", "field"].forEach(function (kind) {
              elements.forEach(function (element) {
                if (element.kind === kind && element.placement === "own") {
                  this.defineClassElement(O, element);
                }
              }, this);
            }, this);
          },
          initializeClassElements: function initializeClassElements(F, elements) {
            var proto = F.prototype;
            ["method", "field"].forEach(function (kind) {
              elements.forEach(function (element) {
                var placement = element.placement;

                if (element.kind === kind && (placement === "static" || placement === "prototype")) {
                  var receiver = placement === "static" ? F : proto;
                  this.defineClassElement(receiver, element);
                }
              }, this);
            }, this);
          },
          defineClassElement: function defineClassElement(receiver, element) {
            var descriptor = element.descriptor;

            if (element.kind === "field") {
              var initializer = element.initializer;
              descriptor = {
                enumerable: descriptor.enumerable,
                writable: descriptor.writable,
                configurable: descriptor.configurable,
                value: initializer === void 0 ? void 0 : initializer.call(receiver)
              };
            }

            Object.defineProperty(receiver, element.key, descriptor);
          },
          decorateClass: function decorateClass(elements, decorators) {
            var newElements = [];
            var finishers = [];
            var placements = {
              static: [],
              prototype: [],
              own: []
            };
            elements.forEach(function (element) {
              this.addElementPlacement(element, placements);
            }, this);
            elements.forEach(function (element) {
              if (!_hasDecorators(element)) return newElements.push(element);
              var elementFinishersExtras = this.decorateElement(element, placements);
              newElements.push(elementFinishersExtras.element);
              newElements.push.apply(newElements, elementFinishersExtras.extras);
              finishers.push.apply(finishers, elementFinishersExtras.finishers);
            }, this);

            if (!decorators) {
              return {
                elements: newElements,
                finishers: finishers
              };
            }

            var result = this.decorateConstructor(newElements, decorators);
            finishers.push.apply(finishers, result.finishers);
            result.finishers = finishers;
            return result;
          },
          addElementPlacement: function addElementPlacement(element, placements, silent) {
            var keys = placements[element.placement];

            if (!silent && keys.indexOf(element.key) !== -1) {
              throw new TypeError("Duplicated element (" + element.key + ")");
            }

            keys.push(element.key);
          },
          decorateElement: function decorateElement(element, placements) {
            var extras = [];
            var finishers = [];

            for (var decorators = element.decorators, i = decorators.length - 1; i >= 0; i--) {
              var keys = placements[element.placement];
              keys.splice(keys.indexOf(element.key), 1);
              var elementObject = this.fromElementDescriptor(element);
              var elementFinisherExtras = this.toElementFinisherExtras((0, decorators[i])(elementObject) || elementObject);
              element = elementFinisherExtras.element;
              this.addElementPlacement(element, placements);

              if (elementFinisherExtras.finisher) {
                finishers.push(elementFinisherExtras.finisher);
              }

              var newExtras = elementFinisherExtras.extras;

              if (newExtras) {
                for (var j = 0; j < newExtras.length; j++) {
                  this.addElementPlacement(newExtras[j], placements);
                }

                extras.push.apply(extras, newExtras);
              }
            }

            return {
              element: element,
              finishers: finishers,
              extras: extras
            };
          },
          decorateConstructor: function decorateConstructor(elements, decorators) {
            var finishers = [];

            for (var i = decorators.length - 1; i >= 0; i--) {
              var obj = this.fromClassDescriptor(elements);
              var elementsAndFinisher = this.toClassDescriptor((0, decorators[i])(obj) || obj);

              if (elementsAndFinisher.finisher !== undefined) {
                finishers.push(elementsAndFinisher.finisher);
              }

              if (elementsAndFinisher.elements !== undefined) {
                elements = elementsAndFinisher.elements;

                for (var j = 0; j < elements.length - 1; j++) {
                  for (var k = j + 1; k < elements.length; k++) {
                    if (elements[j].key === elements[k].key && elements[j].placement === elements[k].placement) {
                      throw new TypeError("Duplicated element (" + elements[j].key + ")");
                    }
                  }
                }
              }
            }

            return {
              elements: elements,
              finishers: finishers
            };
          },
          fromElementDescriptor: function fromElementDescriptor(element) {
            var obj = {
              kind: element.kind,
              key: element.key,
              placement: element.placement,
              descriptor: element.descriptor
            };
            var desc = {
              value: "Descriptor",
              configurable: true
            };
            Object.defineProperty(obj, Symbol.toStringTag, desc);
            if (element.kind === "field") obj.initializer = element.initializer;
            return obj;
          },
          toElementDescriptors: function toElementDescriptors(elementObjects) {
            if (elementObjects === undefined) return;
            return _toArray(elementObjects).map(function (elementObject) {
              var element = this.toElementDescriptor(elementObject);
              this.disallowProperty(elementObject, "finisher", "An element descriptor");
              this.disallowProperty(elementObject, "extras", "An element descriptor");
              return element;
            }, this);
          },
          toElementDescriptor: function toElementDescriptor(elementObject) {
            var kind = String(elementObject.kind);

            if (kind !== "method" && kind !== "field") {
              throw new TypeError('An element descriptor\'s .kind property must be either "method" or' + ' "field", but a decorator created an element descriptor with' + ' .kind "' + kind + '"');
            }

            var key = _toPropertyKey(elementObject.key);

            var placement = String(elementObject.placement);

            if (placement !== "static" && placement !== "prototype" && placement !== "own") {
              throw new TypeError('An element descriptor\'s .placement property must be one of "static",' + ' "prototype" or "own", but a decorator created an element descriptor' + ' with .placement "' + placement + '"');
            }

            var descriptor = elementObject.descriptor;
            this.disallowProperty(elementObject, "elements", "An element descriptor");
            var element = {
              kind: kind,
              key: key,
              placement: placement,
              descriptor: Object.assign({}, descriptor)
            };

            if (kind !== "field") {
              this.disallowProperty(elementObject, "initializer", "A method descriptor");
            } else {
              this.disallowProperty(descriptor, "get", "The property descriptor of a field descriptor");
              this.disallowProperty(descriptor, "set", "The property descriptor of a field descriptor");
              this.disallowProperty(descriptor, "value", "The property descriptor of a field descriptor");
              element.initializer = elementObject.initializer;
            }

            return element;
          },
          toElementFinisherExtras: function toElementFinisherExtras(elementObject) {
            var element = this.toElementDescriptor(elementObject);

            var finisher = _optionalCallableProperty(elementObject, "finisher");

            var extras = this.toElementDescriptors(elementObject.extras);
            return {
              element: element,
              finisher: finisher,
              extras: extras
            };
          },
          fromClassDescriptor: function fromClassDescriptor(elements) {
            var obj = {
              kind: "class",
              elements: elements.map(this.fromElementDescriptor, this)
            };
            var desc = {
              value: "Descriptor",
              configurable: true
            };
            Object.defineProperty(obj, Symbol.toStringTag, desc);
            return obj;
          },
          toClassDescriptor: function toClassDescriptor(obj) {
            var kind = String(obj.kind);

            if (kind !== "class") {
              throw new TypeError('A class descriptor\'s .kind property must be "class", but a decorator' + ' created a class descriptor with .kind "' + kind + '"');
            }

            this.disallowProperty(obj, "key", "A class descriptor");
            this.disallowProperty(obj, "placement", "A class descriptor");
            this.disallowProperty(obj, "descriptor", "A class descriptor");
            this.disallowProperty(obj, "initializer", "A class descriptor");
            this.disallowProperty(obj, "extras", "A class descriptor");

            var finisher = _optionalCallableProperty(obj, "finisher");

            var elements = this.toElementDescriptors(obj.elements);
            return {
              elements: elements,
              finisher: finisher
            };
          },
          runClassFinishers: function runClassFinishers(constructor, finishers) {
            for (var i = 0; i < finishers.length; i++) {
              var newConstructor = (0, finishers[i])(constructor);

              if (newConstructor !== undefined) {
                if (typeof newConstructor !== "function") {
                  throw new TypeError("Finishers must return a constructor.");
                }

                constructor = newConstructor;
              }
            }

            return constructor;
          },
          disallowProperty: function disallowProperty(obj, name, objectType) {
            if (obj[name] !== undefined) {
              throw new TypeError(objectType + " can't have a ." + name + " property.");
            }
          }
        };
        return api;
      }

      function _createElementDescriptor(def) {
        var key = _toPropertyKey(def.key);

        var descriptor;

        if (def.kind === "method") {
          descriptor = {
            value: def.value,
            writable: true,
            configurable: true,
            enumerable: false
          };
        } else if (def.kind === "get") {
          descriptor = {
            get: def.value,
            configurable: true,
            enumerable: false
          };
        } else if (def.kind === "set") {
          descriptor = {
            set: def.value,
            configurable: true,
            enumerable: false
          };
        } else if (def.kind === "field") {
          descriptor = {
            configurable: true,
            writable: true,
            enumerable: true
          };
        }

        var element = {
          kind: def.kind === "field" ? "field" : "method",
          key: key,
          placement: def.static ? "static" : def.kind === "field" ? "own" : "prototype",
          descriptor: descriptor
        };
        if (def.decorators) element.decorators = def.decorators;
        if (def.kind === "field") element.initializer = def.value;
        return element;
      }

      function _coalesceGetterSetter(element, other) {
        if (element.descriptor.get !== undefined) {
          other.descriptor.get = element.descriptor.get;
        } else {
          other.descriptor.set = element.descriptor.set;
        }
      }

      function _coalesceClassElements(elements) {
        var newElements = [];

        var isSameElement = function isSameElement(other) {
          return other.kind === "method" && other.key === element.key && other.placement === element.placement;
        };

        for (var i = 0; i < elements.length; i++) {
          var element = elements[i];
          var other;

          if (element.kind === "method" && (other = newElements.find(isSameElement))) {
            if (_isDataDescriptor(element.descriptor) || _isDataDescriptor(other.descriptor)) {
              if (_hasDecorators(element) || _hasDecorators(other)) {
                throw new ReferenceError("Duplicated methods (" + element.key + ") can't be decorated.");
              }

              other.descriptor = element.descriptor;
            } else {
              if (_hasDecorators(element)) {
                if (_hasDecorators(other)) {
                  throw new ReferenceError("Decorators can't be placed on different accessors with for " + "the same property (" + element.key + ").");
                }

                other.decorators = element.decorators;
              }

              _coalesceGetterSetter(element, other);
            }
          } else {
            newElements.push(element);
          }
        }

        return newElements;
      }

      function _hasDecorators(element) {
        return element.decorators && element.decorators.length;
      }

      function _isDataDescriptor(desc) {
        return desc !== undefined && !(desc.value === undefined && desc.writable === undefined);
      }

      function _optionalCallableProperty(obj, name) {
        var value = obj[name];

        if (value !== undefined && typeof value !== "function") {
          throw new TypeError("Expected '" + name + "' to be a function");
        }

        return value;
      }

      function _toPropertyKey(arg) {
        var key = _toPrimitive(arg, "string");

        return _typeof(key) === "symbol" ? key : String(key);
      }

      function _toPrimitive(input, hint) {
        if (_typeof(input) !== "object" || input === null) return input;
        var prim = input[Symbol.toPrimitive];

        if (prim !== undefined) {
          var res = prim.call(input, hint || "default");
          if (_typeof(res) !== "object") return res;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }

        return (hint === "string" ? String : Number)(input);
      }

      var StripeElementsError =
      /*#__PURE__*/
      function (_Error) {
        _inherits(StripeElementsError, _Error);

        function StripeElementsError(tag, message) {
          var _this2;

          _classCallCheck(this, StripeElementsError);

          _this2 = _possibleConstructorReturn(this, _getPrototypeOf$1(StripeElementsError).call(this, "<".concat(tag, ">: ").concat(message)));
          _this2.originalMessage = message;
          return _this2;
        }

        return StripeElementsError;
      }(_wrapNativeSuper(Error));
      /* istanbul ignore next */


      var removeAllMounts = function removeAllMounts(slotName) {
        return function (host) {
          return host.querySelectorAll("[slot=\"".concat(slotName, "\"][name=\"").concat(slotName, "\"]")).forEach(remove);
        };
      };

      var slotTemplate = function slotTemplate(slotName) {
        return html(_templateObject(), slotName, slotName);
      };

      var mountPointTemplate = function mountPointTemplate(_ref6) {
        var stripeMountId = _ref6.stripeMountId,
            tagName = _ref6.tagName;
        return html(_templateObject2(), ifDefined(stripeMountId), tagName.toLowerCase());
      };
      /**
       * @fires 'error' - The validation error, or the error returned from stripe.com
       * @fires 'payment-method' - The PaymentMethod received from stripe.com
       * @fires 'source' - The Source received from stripe.com
       * @fires 'token' - The Token received from stripe.com
       * @fires 'success' - When a payment succeeds
       * @fires 'ready' - Stripe has been initialized and mounted
       *
       * @fires 'stripe-ready' - **DEPRECATED**. Will be removed in a future major version. Use `ready` instead
       * @fires 'stripe-error' - **DEPRECATED**. Will be removed in a future major version. Use `error` instead
       * @fires 'stripe-payment-method' - **DEPRECATED**. Will be removed in a future major version. Use `payment-method` instead
       * @fires 'stripe-source' - **DEPRECATED**. Will be removed in a future major version. Use `source` instead
       * @fires 'stripe-token' - **DEPRECATED**. Will be removed in a future major version. Use `token` instead
       *
       * @csspart 'error' - container for the error message
       * @csspart 'stripe' - container for the stripe element
       */


      var StripeBase = exports('S', _decorate(null, function (_initialize, _ReadOnlyPropertiesMi) {
        var StripeBase =
        /*#__PURE__*/
        function (_ReadOnlyPropertiesMi2) {
          _inherits(StripeBase, _ReadOnlyPropertiesMi2);

          /* PAYMENT CONFIGURATION */

          /**
           * billing_details object sent to create the payment representation. (optional)
           * @type {stripe.BillingDetails}
           */

          /**
           * Data passed to stripe.createPaymentMethod. (optional)
           * @type {stripe.PaymentMethodData}
           */

          /**
           * Data passed to stripe.createSource. (optional)
           * @type {SourceData}
           */

          /**
           * Data passed to stripe.createToken. (optional)
           * @type {stripe.TokenOptions}
           */

          /* PAYMENT REPRESENTATIONS */

          /**
           * Stripe PaymentMethod
           * @type {stripe.paymentMethod.PaymentMethod}
           * @readonly
           */

          /**
           * Stripe Source
           * @type {stripe.Source}
           * @readonly
           */

          /**
           * Stripe Token
           * @type {stripe.Token}
           * @readonly
           */

          /* SETTINGS */

          /**
           * If set, when Stripe returns the payment info (PaymentMethod, Source, or Token),
           * the element will POST JSON data to this URL with an object containing
           * a key equal to the value of the `generate` property.
           * @example
           * ```html
           * <stripe-elements
           *   publishable-key="pk_test_XXXXXXXXXXXXX"
           *   generate="token"
           *   action="/payment"
           * ></stripe-elements>
           * ```
           * will POST to `/payment` with JSON body `{ "token": { ... } }`
           * ```js
           * stripeElements.submit();
           * ```
           * @type {string}
           */

          /**
           * The `client_secret` part of a Stripe `PaymentIntent`
           * @type {string}
           */

          /**
           * Type of payment representation to generate.
           * @type {'payment-method'|'source'|'token'}
           * @required
           */

          /**
           * Stripe Publishable Key. EG. `pk_test_XXXXXXXXXXXXXXXXXXXXXXXX`
           * @type {string}
           */

          /** Whether to display the error message */

          /* READ-ONLY FIELDS */

          /**
           * Stripe element instance
           * @type {stripe.elements.Element}
           * @readonly
           */

          /**
           * Stripe Elements instance
           * @type {stripe.elements.Elements}
           * @readonly
           */

          /**
           * Stripe or validation error
           * @type {Error|stripe.Error}
           * @readonly
           */

          /**
           * If the element is focused.
           * @type {boolean}
           * @readonly
           */

          /**
           * Whether the stripe element is ready to receive focus.
           * @type {boolean}
           * @readonly
           */

          /**
           * Stripe instance
           * @type {stripe.Stripe}
           * @readonly
           */
          // DEPRECATED

          /**
           * Whether the element has an error
           * **DEPRECATED**. Will be removed in a future version. Use `error` instead
           * @type {boolean}
           * @readonly
           * @deprecated
           */

          /**
           * Whether the stripe element is ready to receive focus.
           * **DEPRECATED**. Will be removed in a future version. use `ready` instead.
           * @deprecated
           * @type {boolean}
           */

          /* PRIVATE FIELDS */

          /**
           * Breadcrumbs back up to the document.
           * @type {Node[]}
           * @private
           */

          /**
           * Stripe.js mount point element. Due to limitations in the Stripe.js library, this element must be connected to the document.
           * @type {Element}
           * @protected
           */

          /**
           * Stripe.js mount point element id. Due to limitations in the Stripe.js library, this element must be connected to the document.
           * @type {string}
           * @protected
           */

          /**
           * Name for breadcrumb slots. Derived from tagName
           * @protected
           * @type {string}
           */

          /* LIFECYCLE */

          /** @inheritdoc */
          function StripeBase() {
            var _this3;

            _classCallCheck(this, StripeBase);

            _this3 = _possibleConstructorReturn(this, _getPrototypeOf$1(StripeBase).call(this));

            _initialize(_assertThisInitialized(_this3));

            _this3.slotName = "".concat(_this3.tagName.toLowerCase(), "-slot");
            return _this3;
          }
          /** @inheritdoc */


          return StripeBase;
        }(_ReadOnlyPropertiesMi);

        return {
          F: StripeBase,
          d: [{
            kind: "field",
            key: "billingDetails",
            value: function value() {
              return {};
            }
          }, {
            kind: "field",
            key: "paymentMethodData",
            value: function value() {
              return {};
            }
          }, {
            kind: "field",
            key: "sourceData",
            value: function value() {
              return {};
            }
          }, {
            kind: "field",
            key: "tokenData",
            value: function value() {
              return {};
            }
          }, {
            kind: "field",
            decorators: [property({
              type: Object,
              notify: true,
              readOnly: true,
              attribute: 'payment-method'
            })],
            key: "paymentMethod",
            value: function value() {
              return null;
            }
          }, {
            kind: "field",
            decorators: [property({
              type: Object,
              notify: true,
              readOnly: true
            })],
            key: "source",
            value: function value() {
              return null;
            }
          }, {
            kind: "field",
            decorators: [property({
              type: Object,
              notify: true,
              readOnly: true
            })],
            key: "token",
            value: function value() {
              return null;
            }
          }, {
            kind: "field",
            decorators: [property({
              type: String
            })],
            key: "action",
            value: void 0
          }, {
            kind: "field",
            decorators: [property({
              type: String,
              attribute: 'client-secret'
            })],
            key: "clientSecret",
            value: void 0
          }, {
            kind: "field",
            decorators: [property({
              type: String
            })],
            key: "generate",
            value: function value() {
              return 'source';
            }
          }, {
            kind: "field",
            decorators: [property({
              type: String,
              attribute: 'publishable-key',
              reflect: true,
              notify: true
            })],
            key: "publishableKey",
            value: void 0
          }, {
            kind: "field",
            decorators: [property({
              type: Boolean,
              attribute: 'show-error',
              reflect: true
            })],
            key: "showError",
            value: function value() {
              return false;
            }
          }, {
            kind: "field",
            decorators: [property({
              type: Object,
              readOnly: true
            })],
            key: "element",
            value: function value() {
              return null;
            }
          }, {
            kind: "field",
            decorators: [property({
              type: Object,
              readOnly: true
            })],
            key: "elements",
            value: function value() {
              return null;
            }
          }, {
            kind: "field",
            decorators: [property({
              type: Object,
              notify: true,
              readOnly: true,
              reflect: true,
              converter: {
                toAttribute: function toAttribute(error) {
                  return !error ? null : error.originalMessage || error.message || '';
                }
              }
            })],
            key: "error",
            value: function value() {
              return null;
            }
          }, {
            kind: "field",
            decorators: [property({
              type: Boolean,
              reflect: true,
              notify: true,
              readOnly: true
            })],
            key: "focused",
            value: function value() {
              return false;
            }
          }, {
            kind: "field",
            decorators: [property({
              type: Boolean,
              reflect: true,
              notify: true,
              readOnly: true
            })],
            key: "ready",
            value: function value() {
              return false;
            }
          }, {
            kind: "field",
            decorators: [property({
              type: Object,
              readOnly: true
            })],
            key: "stripe",
            value: function value() {
              return null;
            }
          }, {
            kind: "field",
            decorators: [property({
              type: Boolean,
              attribute: 'has-error',
              reflect: true,
              notify: true,
              readOnly: true
            })],
            key: "hasError",
            value: function value() {
              return false;
            }
          }, {
            kind: "field",
            decorators: [property({
              type: Boolean,
              attribute: 'stripe-ready',
              reflect: true,
              notify: true,
              readOnly: true
            })],
            key: "stripeReady",
            value: function value() {
              return false;
            }
          }, {
            kind: "field",
            key: "shadowHosts",
            value: function value() {
              return [];
            }
          }, {
            kind: "get",
            key: "stripeMount",
            value: function stripeMount() {
              return document.getElementById(this.stripeMountId);
            }
          }, {
            kind: "field",
            key: "stripeMountId",
            value: void 0
          }, {
            kind: "field",
            key: "slotName",
            value: void 0
          }, {
            kind: "method",
            key: "render",
            value: function render() {
              var error = this.error,
                  showError = this.showError,
                  slotName = this.slotName;
              var errorMessage = (error === null || error === void 0 ? void 0 : error.originalMessage) || (error === null || error === void 0 ? void 0 : error.message);
              return html(_templateObject3(), slotName, !showError, ifDefined(errorMessage));
            }
          }, {
            kind: "method",
            key: "firstUpdated",
            value: function firstUpdated() {
              this.destroyMountPoints();
              this.initMountPoints();
            }
            /** @inheritdoc */

          }, {
            kind: "method",
            key: "updated",
            value: function updated(changed) {
              var _get2;

              (_get2 = _get(_getPrototypeOf(StripeBase.prototype), "updated", this)) === null || _get2 === void 0 ? void 0 : _get2(changed);
              if (changed.has('error')) this.errorChanged();
              if (changed.has('publishableKey')) this.init();

              _toConsumableArray(changed.keys()).forEach(this.representationChanged);
            }
            /* PUBLIC API */

            /**
             * Resets and clears the stripe element.
             */

          }, {
            kind: "method",
            key: "reset",
            value: function reset() {
              var _this$element, _this$element$clear;

              (_this$element = this.element) === null || _this$element === void 0 ? void 0 : (_this$element$clear = _this$element.clear) === null || _this$element$clear === void 0 ? void 0 : _this$element$clear.call(_this$element);
              this.resetRepresentations();
              this.set({
                error: null
              });
            }
            /** Blurs the element. */

          }, {
            kind: "method",
            key: "blur",
            value: function blur() {
              var _this$element2;

              (_this$element2 = this.element) === null || _this$element2 === void 0 ? void 0 : _this$element2.blur();
            }
            /** Focuses the element. */

          }, {
            kind: "method",
            key: "focus",
            value: function focus() {
              var _this$element3;

              (_this$element3 = this.element) === null || _this$element3 === void 0 ? void 0 : _this$element3.focus();
            }
            /* PRIVATE API */

            /**
             * Creates a new StripeElementsError
             * @param  {string} message
             * @return {StripeElementsError}
             * @private
             */

          }, {
            kind: "method",
            key: "createError",
            value: function createError(message) {
              return new StripeElementsError(this.constructor.is, message);
            }
            /**
             * Clears the Payment Representation and fires an error event
             * @private
             */

          }, {
            kind: "method",
            key: "errorChanged",
            value: function () {
              var _errorChanged = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee2() {
                var hasError;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        // DEPRECATED
                        hasError = !!this.error;
                        _context2.next = 3;
                        return this.set({
                          hasError: hasError
                        });

                      case 3:
                        // END DEPRECATED
                        this.resetRepresentations();
                        this.fireError(this.error);

                      case 5:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, this);
              }));

              function errorChanged() {
                return _errorChanged.apply(this, arguments);
              }

              return errorChanged;
            }()
            /**
             * Fires an event.
             * @param  {string} type      event type
             * @param  {any}    detail    detail value
             * @param  {EventInit} [opts={}]
             * @private
             */

          }, {
            kind: "method",
            key: "fire",
            value: function fire(type, detail) {
              var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
              this.dispatchEvent(new CustomEvent(type, _objectSpread2({
                detail: detail
              }, opts)));
            }
            /**
             * Fires an Error Event
             * @param  {Error} error
             * @private
             */

          }, {
            kind: "method",
            key: "fireError",
            value: function fireError(error) {
              this.dispatchEvent(new ErrorEvent('error', {
                error: error
              })); // DEPRECATED

              this.dispatchEvent(new ErrorEvent('stripe-error', {
                bubbles: true,
                error: error
              }));
            }
            /**
             * Gets a CSS Custom Property value, respecting ShadyCSS.
             * @param  {string} propertyName    CSS Custom Property
             * @param  {CSSStyleDeclaration}    [precomputedStyle] pre-computed style declaration
             * @return {any}
             * @private
             */

          }, {
            kind: "method",
            key: "getCSSCustomPropertyValue",
            value: function getCSSCustomPropertyValue(propertyName, precomputedStyle) {
              if (window.ShadyCSS) return ShadyCSS.getComputedStyleValue(this, propertyName);else return precomputedStyle.getPropertyValue(propertyName);
            }
            /**
             * Sets the token or error from the response.
             * @param  {PaymentResponse} response       Stripe Response
             * @return {PaymentResponse}
             * @private
             */

          }, {
            kind: "method",
            decorators: [bound],
            key: "handleResponse",
            value: function () {
              var _handleResponse = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee3(response) {
                var _response$error, error, _response$paymentMeth, paymentMethod, _response$source, source, _response$token, token;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _response$error = response.error, error = _response$error === void 0 ? null : _response$error, _response$paymentMeth = response.paymentMethod, paymentMethod = _response$paymentMeth === void 0 ? null : _response$paymentMeth, _response$source = response.source, source = _response$source === void 0 ? null : _response$source, _response$token = response.token, token = _response$token === void 0 ? null : _response$token;
                        _context3.next = 3;
                        return this.set({
                          error: error,
                          paymentMethod: paymentMethod,
                          source: source,
                          token: token
                        });

                      case 3:
                        if (!error) {
                          _context3.next = 7;
                          break;
                        }

                        throw error;

                      case 7:
                        return _context3.abrupt("return", response);

                      case 8:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, this);
              }));

              function handleResponse(_x3) {
                return _handleResponse.apply(this, arguments);
              }

              return handleResponse;
            }()
            /**
             * Removes all mount points from the DOM
             * @private
             */

          }, {
            kind: "method",
            key: "destroyMountPoints",
            value: function destroyMountPoints() {
              this.shadowHosts.forEach(removeAllMounts(this.slotName));
              if (this.stripeMount) this.stripeMount.remove();
            }
            /**
             * Reinitializes Stripe and mounts the element.
             * @private
             */

          }, {
            kind: "method",
            key: "init",
            value: function () {
              var _init = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return this.unmount();

                      case 2:
                        _context4.next = 4;
                        return this.initStripe();

                      case 4:
                        _context4.next = 6;
                        return this.initElement();

                      case 6:
                        this.initElementListeners();
                        this.destroyMountPoints();
                        this.initMountPoints();
                        this.mount();

                      case 10:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4, this);
              }));

              function init() {
                return _init.apply(this, arguments);
              }

              return init;
            }()
            /**
             * Adds `ready`, `focus`, and `blur` listeners to the Stripe Element
             * @private
             */

          }, {
            kind: "method",
            key: "initElementListeners",
            value: function initElementListeners() {
              if (!this.element) return;
              this.element.addEventListener('ready', this.onReady);
              this.element.addEventListener('focus', this.onFocus);
              this.element.addEventListener('blur', this.onBlur);
            }
            /**
             * Creates mount points for the Stripe Element
             * @private
             */

          }, {
            kind: "method",
            key: "initMountPoints",
            value: function initMountPoints() {
              this.stripeMountId = generateRandomMountElementId(this.tagName);
              if (window.ShadyDOM) appendTemplate(mountPointTemplate(this), this);else this.initShadowMountPoints();
            }
            /**
             * Prepares to mount Stripe Elements in light DOM.
             * @private
             */

          }, {
            kind: "method",
            key: "initShadowMountPoints",
            value: function initShadowMountPoints() {
              // trace each shadow boundary between us and the document
              var host = this;
              this.shadowHosts = [this];

              while (host = host.getRootNode().host) {
                this.shadowHosts.push(host);
              } // eslint-disable-line prefer-destructuring, no-loops/no-loops


              var shadowHosts = this.shadowHosts,
                  slotName = this.slotName; // Prepare the shallowest breadcrumb slot at document level

              var hosts = _toConsumableArray(shadowHosts);

              var root = hosts.pop();

              if (!root.querySelector("[slot=\"".concat(slotName, "\"]"))) {
                var div = document.createElement('div');
                div.slot = slotName;
                root.appendChild(div);
              }

              var container = root.querySelector("[slot=\"".concat(slotName, "\"]")); // Render the form to the document, so that Stripe.js can mount

              appendTemplate(mountPointTemplate(this), container); // Append breadcrumb slots to each shadowroot in turn,
              // from the document down to the <stripe-elements> instance.

              hosts.forEach(appendTemplate(slotTemplate(slotName)));
            }
            /**
             * Initializes Stripe and elements.
             * @private
             */

          }, {
            kind: "method",
            key: "initStripe",
            value: function () {
              var _initStripe = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee5() {
                var publishableKey, stripe, elements, error;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        publishableKey = this.publishableKey;
                        stripe = window.Stripe && publishableKey ? Stripe(publishableKey) : null;
                        elements = stripe && stripe.elements();
                        error = stripe ? null : this.createError('requires Stripe.js to be loaded first.');
                        if (error) console.warn(error.message); // eslint-disable-line no-console

                        _context5.next = 7;
                        return this.set({
                          elements: elements,
                          error: error,
                          stripe: stripe
                        });

                      case 7:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5, this);
              }));

              function initStripe() {
                return _initStripe.apply(this, arguments);
              }

              return initStripe;
            }()
            /**
             * Mounts the Stripe Element
             * @private
             */

          }, {
            kind: "method",
            key: "mount",
            value: function mount() {
              var _this$element4;
              /* istanbul ignore next */


              if (!this.stripeMount) throw this.createError('Stripe Mount missing');
              (_this$element4 = this.element) === null || _this$element4 === void 0 ? void 0 : _this$element4.mount(this.stripeMount);
            }
            /**
             * Unmounts and nullifies the card.
             * @private
             */

          }, {
            kind: "method",
            key: "unmount",
            value: function () {
              var _unmount = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee6() {
                var _this$element5;

                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        (_this$element5 = this.element) === null || _this$element5 === void 0 ? void 0 : _this$element5.unmount();
                        _context6.next = 3;
                        return this.set({
                          element: null
                        });

                      case 3:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6, this);
              }));

              function unmount() {
                return _unmount.apply(this, arguments);
              }

              return unmount;
            }()
            /**
             * @param  {StripeFocusEvent} event
             * @private
             */

          }, {
            kind: "method",
            decorators: [bound],
            key: "onBlur",
            value: function () {
              var _onBlur = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee7() {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.next = 2;
                        return this.set({
                          focused: false
                        });

                      case 2:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7, this);
              }));

              function onBlur() {
                return _onBlur.apply(this, arguments);
              }

              return onBlur;
            }()
            /**
             * @param  {StripeFocusEvent} event
             * @private
             */

          }, {
            kind: "method",
            decorators: [bound],
            key: "onFocus",
            value: function () {
              var _onFocus = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee8() {
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        _context8.next = 2;
                        return this.set({
                          focused: true
                        });

                      case 2:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8, this);
              }));

              function onFocus() {
                return _onFocus.apply(this, arguments);
              }

              return onFocus;
            }()
            /**
             * Sets the `ready` property when the stripe element is ready to receive focus.
             * @param  {Event} event
             * @private
             */

          }, {
            kind: "method",
            decorators: [bound],
            key: "onReady",
            value: function () {
              var _onReady = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee9(event) {
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        _context9.next = 2;
                        return this.set({
                          ready: true,
                          stripeReady: true
                        });

                      case 2:
                        this.fire('ready', event); // DEPRECATED

                        this.fire('stripe-ready', event);

                      case 4:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9, this);
              }));

              function onReady(_x4) {
                return _onReady.apply(this, arguments);
              }

              return onReady;
            }()
            /**
             * POSTs the payment info represenation to the endpoint at `/action`
             * @resolves {void}
             * @private
             */

          }, {
            kind: "method",
            key: "postRepresentation",
            value: function () {
              var _postRepresentation = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee10() {
                var _this4 = this;

                var onError, onSuccess, token, source, paymentMethod, body, headers, method;
                return regeneratorRuntime.wrap(function _callee10$(_context10) {
                  while (1) {
                    switch (_context10.prev = _context10.next) {
                      case 0:
                        onError = function onError(error) {
                          return _this4.set({
                            error: error
                          });
                        };

                        onSuccess = function onSuccess(success) {
                          _this4.fire('success', success); // DEPRECATED


                          _this4.fire('stripe-payment-success', success);
                        };

                        token = this.token || undefined;
                        source = this.source || undefined;
                        paymentMethod = this.paymentMethod || undefined;
                        body = JSON.stringify({
                          token: token,
                          source: source,
                          paymentMethod: paymentMethod
                        });
                        headers = {
                          'Content-Type': 'application/json'
                        };
                        method = 'POST';
                        return _context10.abrupt("return", fetch(this.action, {
                          body: body,
                          headers: headers,
                          method: method
                        }).then(throwBadResponse).then(onSuccess).catch(onError));

                      case 9:
                      case "end":
                        return _context10.stop();
                    }
                  }
                }, _callee10, this);
              }));

              function postRepresentation() {
                return _postRepresentation.apply(this, arguments);
              }

              return postRepresentation;
            }()
            /**
             * @param {string} name
             * @private
             */

          }, {
            kind: "method",
            decorators: [bound],
            key: "representationChanged",
            value: function representationChanged(name) {
              if (!isRepresentation(name)) return;
              var value = this[name];
              /* istanbul ignore if */

              if (!value) return; // DEPRECATED

              this.fire("stripe-".concat(dash(name)), value);
              this.fire("".concat(dash(name)), value);
              if (this.action) this.postRepresentation();
            }
            /**
             * Resets the Payment Representations
             * @private
             */

          }, {
            kind: "method",
            key: "resetRepresentations",
            value: function resetRepresentations() {
              this.set({
                paymentMethod: null,
                token: null,
                source: null
              });
            }
          }]
        };
      }, ReadOnlyPropertiesMixin(LitNotify(LitElement))));
      /** @typedef {stripe.PaymentIntentResponse|stripe.PaymentMethodResponse|stripe.SetupIntentResponse|stripe.TokenResponse|stripe.SourceResponse} PaymentResponse */

      /** @typedef {{ owner: stripe.OwnerData }} SourceData */

      /** @typedef {{ elementType: stripe.elements.elementsType }} StripeFocusEvent */


      var sharedStyles = exports('s', css$1(_templateObject4()));

      var compose = function compose() {
        for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
          fns[_key] = arguments[_key];
        }

        return fns.reduce(function (f, g) {
          return function () {
            return f(g.apply(void 0, arguments));
          };
        });
      };

      var isString = function isString(x) {
        return typeof x === 'string';
      };

      var trim = function trim(s) {
        return s.trim();
      };

      var isObject = function isObject(x) {
        return x !== null && "".concat(x) === '[object Object]';
      };

      var replace = function replace() {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return function (s) {
          return s.replace.apply(s, args);
        };
      };

      var isAllStrings = function isAllStrings(xs) {
        return Array.isArray(xs) && xs.every(isString);
      };

      var fromEntries = function fromEntries(xs) {
        return Object.fromEntries ? Object.fromEntries(xs) : xs.reduce(function (o, _ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              k = _ref2[0],
              v = _ref2[1];

          return Object.assign(_defineProperty$1({}, k, v), o);
        }, {});
      };

      var flatMap = function flatMap(f) {
        return function (xs) {
          return 'flatMap' in Array.prototype ? xs.flatMap(f) : xs.reduce(function (acc, x) {
            return acc.concat(f(x));
          }, []);
        };
      };

      var pick = function pick(keys, element) {
        return keys.reduce(function (pojo, key) {
          return Object.assign(pojo, _defineProperty$1({}, key, element[key]));
        }, {});
      };

      var stripUndefinedVals = flatMap(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            k = _ref4[0],
            v = _ref4[1];

        return v === undefined ? [] : [[k, v]];
      });
      var stripUndefined = compose(fromEntries, stripUndefinedVals, Object.entries);

      var mark = function mark(x) {
        return x instanceof Element ? "<mark class='string'>".concat(x.outerHTML.replace(/</g, '&lt;').replace(/"/g, '\''), "</mark>") : isObject(x) || Array.isArray(x) ? x : "<mark class='".concat(x === null ? 'null' : _typeof(x), "'>").concat(x, "</mark>");
      };

      var replacer = function replacer(k, v) {
        return k === '' ? v : mark(v);
      };

      var pretty = function pretty(o) {
        return JSON.stringify(o, replacer, 2);
      };

      var markKeys = replace(/"(.*)":/g, function (_, key) {
        return "<mark class=\"key\">\"".concat(key, "\"</mark>:");
      });
      var wrapStrings = replace(/"<mark(.*)>(.*)<\/mark>"/g, function (_, attrs, content) {
        return "<mark".concat(attrs, ">").concat(attrs.includes('string') ? "\"".concat(content, "\"") : content, "</mark>");
      });
      var json = compose(wrapStrings, markKeys, pretty, stripUndefined);
      var css = "\n[hidden],\n:host([hidden]) {\n  display: none !important;\n}\n\n:host {\n  display: block;\n  position: relative;\n  color: var(--json-viewer-color, currentColor);\n  background: var(--json-viewer-background);\n}\n\nmark { background: none; }\nmark.key { color: var(--json-viewer-key-color); }\nmark.boolean { color: var(--json-viewer-boolean-color); }\nmark.number { color: var(--json-viewer-number-color); }\nmark.null { color: var(--json-viewer-null-color); }\nmark.string { color: var(--json-viewer-string-color); }\n\n@media (prefers-color-scheme: dark), (prefers-color-scheme: no-preference) {\n  :host {\n    --json-viewer-color: white;\n    --json-viewer-background: #212529;\n    --json-viewer-key-color: #ff922b;\n    --json-viewer-boolean-color: #22b8cf;\n    --json-viewer-number-color: #51cf66;\n    --json-viewer-null-color: #ff6b6b;\n    --json-viewer-string-color: #22b8cf;\n  }\n}\n\n@media (prefers-color-scheme: light) {\n  :host {\n    --json-viewer-color: #212529;\n    --json-viewer-background: white;\n    --json-viewer-key-color: #f76707;\n    --json-viewer-boolean-color: #0c8599;\n    --json-viewer-number-color: #0ca678;\n    --json-viewer-null-color: #e03131;\n    --json-viewer-string-color: #0c8599;\n  }\n}\n";
      var template = document.createElement('template');
      template.innerHTML = "\n<code hidden>\n  <pre></pre>\n</code>\n";
      var WLATTR = 'whitelist';
      /**
       * Custom Element that shows a JavaScript object's properties as syntax-highlighted JSON.
       *
       * The element will respect `prefers-color-scheme` by default, but if you use the
       * CSS Custom Properties listed below, you should customize both light and dark themes.
       *
       * ❤️ Proudly uses [open-wc](https://open-wc.org) tools and recommendations.
       *
       * @example
       * ```javascript
       * const properties = {foo: 'foo', bar: 'bar', baz: 'baz'};
       * const template = html`<json-viewer .object="${properties}" whitelist="foo,bar"></json-viewer>`;
       * render(template, document.body);
       * ```
       *
       * @example
       * ```html
       * <json-viewer whitelist="foo,bar">
       * {
       *   "foo": "foo",
       *   "bar": "bar",
       *   "baz": "baz"
       * }
       * </json-viewer>
       * ```
       *
       * @cssprop --json-viewer-color - Color for generic text. Light white, Dark #212121
       * @cssprop --json-viewer-background - Color for generic text. Light #212121, Dark white
       * @cssprop --json-viewer-key-color - Color for keys. Light #f76707, Dark #ff922b
       * @cssprop --json-viewer-boolean-color - Color for booleans. Light #f76707, Dark #22b8cf
       * @cssprop --json-viewer-number-color - Color for numbers. Light #0ca678, Dark #51cf66
       * @cssprop --json-viewer-null-color - Color for nulls. Light #e03131, Dark #ff6b6b
       * @cssprop --json-viewer-string-color - Color for strings. Light #0c8599, Dark #22b8cf
       *
       * @slot - JSON strings appended as text nodes will be parsed and displayed
       */

      var JsonViewer =
      /*#__PURE__*/
      function (_HTMLElement) {
        _inherits(JsonViewer, _HTMLElement);

        _createClass(JsonViewer, [{
          key: "object",

          /**
           * Object to display
           * @type {object}
           */
          get: function get() {
            return this.__object;
          },
          set: function set(val) {
            this.__object = val;
            this.render();
          }
          /**
           * Whitelist of keys for the object.
           * Required if setting `object` to a non-serializable object (e.g. an HTMLElement)
           * @type {string[]}
           * @attr
           */

        }, {
          key: "whitelist",
          get: function get() {
            return this.__whitelist;
          },
          set: function set(val) {
            if (!isAllStrings(val)) {
              throw new Error('whitelist must be an array of strings');
            }

            this.__whitelist = val;
            var attr = val.join(',');
            this.setAttribute(WLATTR, attr);
            this.render();
          }
        }], [{
          key: "is",
          get: function get() {
            return 'json-viewer';
          }
        }, {
          key: "observedAttributes",
          get: function get() {
            return [WLATTR];
          }
        }]);

        function JsonViewer() {
          var _this;

          _classCallCheck(this, JsonViewer);

          _this = _possibleConstructorReturn(this, _getPrototypeOf$1(JsonViewer).call(this));
          _this.__mo = new MutationObserver(_this.parse.bind(_assertThisInitialized(_this)));

          _this.__mo.observe(_assertThisInitialized(_this), {
            subtree: false,
            characterData: true
          });

          _this.attachShadow({
            mode: 'open'
          });

          if ('adoptedStyleSheets' in Document.prototype) {
            var styles = new CSSStyleSheet();
            styles.replaceSync(css);
            _this.shadowRoot.adoptedStyleSheets = [styles];
          } else {
            _this.shadowRoot.innerHTML = "<style>".concat(css, "</style>");
          }

          _this.shadowRoot.append(template.content.cloneNode(true));

          return _this;
        }

        _createClass(JsonViewer, [{
          key: "attributeChangedCallback",
          value: function attributeChangedCallback(_, __, whitelist) {
            this.whitelist = whitelist.split(',').map(trim);
          }
        }, {
          key: "connectedCallback",
          value: function connectedCallback() {
            this.parse();
          }
          /**
           * @private
           * @return {string} syntax-highlighted HTML string
           */

        }, {
          key: "getHighlightedDomString",
          value: function getHighlightedDomString() {
            var whitelist = this.whitelist,
                object = this.object;
            return object === undefined ? '' : json(whitelist ? pick(whitelist, object) : object);
          }
          /** @private */

        }, {
          key: "render",
          value: function render() {
            var highlighted = this.getHighlightedDomString();
            this.shadowRoot.querySelector('code').hidden = !highlighted;
            this.shadowRoot.querySelector('pre').innerHTML = highlighted;
          }
          /** @private */

        }, {
          key: "parse",
          value: function parse() {
            if (!this.textContent.trim()) return;

            try {
              this.object = JSON.parse(this.textContent);
            } catch (_) {
              this.object = undefined;
            }
          }
        }]);

        return JsonViewer;
      }(_wrapNativeSuper(HTMLElement));
      customElements.define(JsonViewer.is, JsonViewer);

      var identity$1 = function identity(x) {
        return x;
      };
      /** camelCase a string */


      var camel$1 = memoize(identity$1, camelCase);

      function _templateObject5() {
        var data = _taggedTemplateLiteral([":host{grid-template-areas:'stripe' 'output'}"]);

        _templateObject5 = function _templateObject5() {
          return data;
        };

        return data;
      }

      function _templateObject4$1() {
        var data = _taggedTemplateLiteral([" <div id=\"stripe\" ?hidden=\"", "\"><slot></slot></div> <json-viewer .object=\"", "\"> </json-viewer> "]);

        _templateObject4$1 = function _templateObject4() {
          return data;
        };

        return data;
      }

      function _templateObject3$1() {
        var data = _taggedTemplateLiteral([" <div id=\"stripe\" ?hidden=\"", "\"> <slot></slot> </div> <div id=\"actions\" ?hidden=\"", "\"> <slot name=\"actions\"> <mwc-textfield outlined label=\"Cardholder Name\" data-owner-prop=\"name\" value=\"Mr. Man\"> </mwc-textfield> <mwc-textfield outlined label=\"Cardholder Email\" data-owner-prop=\"email\" value=\"mr@man.email\"> </mwc-textfield> <mwc-textfield outlined label=\"Cardholder Phone\" data-owner-prop=\"phone\" value=\"555 555 5555\"> </mwc-textfield> <mwc-button ?disabled=\"", "\" outlined @click=\"", "\">", "</mwc-button> </slot> </div> <json-viewer .object=\"", "\"> </json-viewer> "]);

        _templateObject3$1 = function _templateObject3() {
          return data;
        };

        return data;
      }

      function _templateObject2$1() {
        var data = _taggedTemplateLiteral([":host{grid-template-areas:'stripe stripe' 'fields fields'}#actions{display:contents}"]);

        _templateObject2$1 = function _templateObject2() {
          return data;
        };

        return data;
      }

      function _templateObject$1() {
        var data = _taggedTemplateLiteral(["[hidden]{display:none!important}:host{align-items:center;display:grid;grid-gap:12px}#stripe{display:contents}::slotted([publishable-key]){grid-area:stripe}"]);

        _templateObject$1 = function _templateObject() {
          return data;
        };

        return data;
      }
      var $ = exports('$', function $(x) {
        return document.querySelector(x);
      });
      var $$ = function $$(x) {
        return _toConsumableArray(document.querySelectorAll(x));
      };

      var compose$1 = function compose() {
        for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
          fns[_key] = arguments[_key];
        }

        return fns.reduce(function (f, g) {
          return function () {
            return f(g.apply(void 0, arguments));
          };
        });
      };

      var LS_KEYS = Object.freeze({
        publishableKey: '__STRIPE_PUBLISHABLE_KEY__',
        clientSecret: '__STRIPE_CLIENT_SECRET__'
      });
      var publishableKey = exports('p', localStorage.getItem(LS_KEYS.publishableKey) || 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX');

      var setProp = function setProp(prop, value) {
        return function (el) {
          return el[prop] = value;
        };
      };

      var storePublishableKey = function storePublishableKey(publishableKey) {
        localStorage.setItem(LS_KEYS.publishableKey, publishableKey);
        return publishableKey;
      };

      var setProps = function setProps(propName) {
        return function (selector) {
          return function (_ref) {
            var value = _ref.target.value;
            $$(selector).forEach(setProp(propName, value));
            return value;
          };
        };
      };

      var setKeys = exports('c', function setKeys(x) {
        return compose$1(storePublishableKey, setProps('publishableKey')(x));
      });
      var setClientSecrets = exports('g', setProps('clientSecret'));

      var fieldEntry = function fieldEntry(field) {
        return [field.dataset.ownerProp, field.value];
      };

      var shared = css$1(_templateObject$1());

      var DemoBase =
      /*#__PURE__*/
      function (_LitElement) {
        _inherits(DemoBase, _LitElement);

        _createClass(DemoBase, [{
          key: "stripe",
          get: function get() {
            return this.querySelector(this.constructor.selector);
          }
        }], [{
          key: "properties",
          get: function get() {
            return {
              output: {
                type: Object
              }
            };
          }
        }]);

        function DemoBase() {
          var _this;

          _classCallCheck(this, DemoBase);

          _this = _possibleConstructorReturn(this, _getPrototypeOf$1(DemoBase).call(this));
          _this.display = _this.display.bind(_assertThisInitialized(_this));
          return _this;
        }

        _createClass(DemoBase, [{
          key: "attachStripeListeners",
          value: function attachStripeListeners() {
            this.stripe.addEventListener('success', this.display);
            this.stripe.addEventListener('fail', this.display);
          }
        }, {
          key: "removeStripeListeners",
          value: function removeStripeListeners() {
            this.stripe.removeEventListener('success', this.display);
            this.stripe.removeEventListener('fail', this.display);
          }
        }, {
          key: "connectedCallback",
          value: function connectedCallback() {
            _get$1(_getPrototypeOf$1(DemoBase.prototype), "connectedCallback", this).call(this);

            var mo = new MutationObserver(this.attachStripeListeners);
            mo.observe(this, {
              childList: true
            });
            this.attachStripeListeners();
          }
        }, {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            _get$1(_getPrototypeOf$1(DemoBase.prototype), "disconnectedCallback", this).call(this);

            this.removeStripeListeners();
          }
        }, {
          key: "display",
          value: function display(_ref3) {
            var target = _ref3.target;
            var val = target[camel$1(target.generate)];
            this.output = val;
          }
        }]);

        return DemoBase;
      }(LitElement);

      customElements.define('elements-demo',
      /*#__PURE__*/
      function (_DemoBase) {
        _inherits(ElementsDemo, _DemoBase);

        _createClass(ElementsDemo, null, [{
          key: "properties",
          get: function get() {
            return {
              submitDisabled: {
                type: Boolean
              },
              label: {
                type: String
              }
            };
          }
        }, {
          key: "styles",
          get: function get() {
            return [shared, css$1(_templateObject2$1())];
          }
        }, {
          key: "selector",
          get: function get() {
            return 'stripe-elements';
          }
        }]);

        function ElementsDemo() {
          var _this2;

          _classCallCheck(this, ElementsDemo);

          _this2 = _possibleConstructorReturn(this, _getPrototypeOf$1(ElementsDemo).call(this));
          _this2.onChange = _this2.onChange.bind(_assertThisInitialized(_this2));
          _this2.submitDisabled = true;

          var stripe = _this2.querySelector(_this2.constructor.selector);

          if (!stripe) return _possibleConstructorReturn(_this2);
          return _this2;
        }

        _createClass(ElementsDemo, [{
          key: "attachStripeListeners",
          value: function attachStripeListeners() {
            _get$1(_getPrototypeOf$1(ElementsDemo.prototype), "attachStripeListeners", this).call(this);

            this.stripe.addEventListener('change', this.onChange);
          }
        }, {
          key: "removeStripeListeners",
          value: function removeStripeListeners() {
            _get$1(_getPrototypeOf$1(ElementsDemo.prototype), "removeStripeListeners", this).call(this);

            this.stripe.removeEventListener('change', this.onChange);
          }
        }, {
          key: "validate",
          value: function validate() {
            return this.stripe.validate();
          }
        }, {
          key: "render",
          value: function render() {
            return html(_templateObject3$1(), this.output, this.output, this.submitDisabled, this.onClickSubmit, this.label, this.output);
          }
        }, {
          key: "onClickSubmit",
          value: function () {
            var _onClickSubmit = _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee() {
              var _this$shadowRoot$quer, _this$shadowRoot$quer2, element;

              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _this$shadowRoot$quer = this.shadowRoot.querySelector('#stripe slot').assignedElements(), _this$shadowRoot$quer2 = _slicedToArray(_this$shadowRoot$quer, 1), element = _this$shadowRoot$quer2[0];
                      element.billingDetails = this.billingDetails;
                      _context.next = 4;
                      return element.submit();

                    case 4:
                      this.output = _context.sent;

                    case 5:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee, this);
            }));

            function onClickSubmit() {
              return _onClickSubmit.apply(this, arguments);
            }

            return onClickSubmit;
          }()
        }, {
          key: "onChange",
          value: function onChange(_ref4) {
            var isComplete = _ref4.target.isComplete;
            this.submitDisabled = !isComplete;
          }
        }, {
          key: "billingDetails",
          get: function get() {
            var slot = this.shadowRoot.querySelector('slot[name="actions"]');
            var assigned = slot.assignedElements();
            var elements = assigned.length ? assigned : _toConsumableArray(slot.children);
            return Object.fromEntries(elements.map(fieldEntry));
          }
        }]);

        return ElementsDemo;
      }(DemoBase));
      customElements.define('payment-request-demo',
      /*#__PURE__*/
      function (_DemoBase2) {
        _inherits(PaymentRequestDemo, _DemoBase2);

        function PaymentRequestDemo() {
          _classCallCheck(this, PaymentRequestDemo);

          return _possibleConstructorReturn(this, _getPrototypeOf$1(PaymentRequestDemo).apply(this, arguments));
        }

        _createClass(PaymentRequestDemo, [{
          key: "render",
          value: function render() {
            return html(_templateObject4$1(), this.output, this.output);
          }
        }], [{
          key: "styles",
          get: function get() {
            return [shared, css$1(_templateObject5())];
          }
        }, {
          key: "selector",
          get: function get() {
            return 'stripe-payment-request';
          }
        }]);

        return PaymentRequestDemo;
      }(DemoBase));

    }
  };
});
//# sourceMappingURL=storybook-helpers-77e3c655.js.map
