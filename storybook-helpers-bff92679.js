import { r as render, h as html, i as ifDefined } from './lit-html-ad749610.js';
import { c as css$1, _ as _toArray, p as property, b as _defineProperty, L as LitElement } from './lit-element-785ef095.js';

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
function eventNameForProperty(name, options = {}) {
  if (options.notify && typeof options.notify === 'string') {
    return options.notify;
  }

  if (options.attribute && typeof options.attribute === 'string') {
    return `${options.attribute}-changed`;
  }

  return `${name.toLowerCase()}-changed`;
} // eslint-disable-next-line valid-jsdoc

/**
 * Enables the nofity option for properties to fire change notification events
 *
 * @template TBase
 * @param {Constructor<TBase>} baseElement
 */

const LitNotify = baseElement => class NotifyingElement extends baseElement {
  /**
   * Extend the LitElement `createProperty` method to map properties to events
   */
  static createProperty(name, options) {
    super.createProperty(name, options);

    if (!this._propertyEventMap) {
      this._propertyEventMap = new Map();
    }

    if (options.notify) {
      this._propertyEventMap.set(name, eventNameForProperty(name, options));
    }
  }
  /**
   * check for changed properties with notify option and fire the events
   */


  update(changedProps) {
    super.update(changedProps);

    if (!this.constructor._propertyEventMap) {
      return;
    }

    for (const [eventProp, eventName] of this.constructor._propertyEventMap.entries()) {
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
  }

};

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

const allCapitalLetterGroups = /[A-ZÀ-ÖÙ-Ý]+/g;
const allLowercaseWords = /[a-zà-öù-ý]+/g;
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
  const words = value.replace(allCapitalLetterGroups, brokenLowered).match(allLowercaseWords);
  return words ? words.join('-') : '';

  function brokenLowered(s) {
    return ' ' + (s.length > 2 ? s.slice(0, -1) + ' ' + s.slice(-1) : s).toLowerCase();
  }
}

const allCapitalLetterGroups$1 = /[A-ZÀ-ÖÙ-Ý]+/g;
const allWords = /[A-ZÀ-ÖÙ-Ýa-zà-öù-ý]+/g;
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
  const words = value.replace(allCapitalLetterGroups$1, valleyCase).match(allWords);
  return words ? words[0][0].toLowerCase() + words.map(x => x[0].toUpperCase() + x.slice(1)).join('').slice(1) : '';

  function valleyCase(s) {
    return s.length > 2 ? s[0] + s.slice(1, -1).toLowerCase() + s.slice(-1) : s;
  }
}

function createCache() {
  const cache = {};
  return {
    has: key => Object.hasOwnProperty.call(cache, key),
    get: key => cache[key],
    set: (key, value) => {
      cache[key] = value;
    }
  };
}

function memoize(cacheKeyFn, fn) {
  const cache = createCache();
  return (...args) => {
    const key = cacheKeyFn(...args);

    if (!cache.has(key)) {
      cache.set(key, fn(...args));
    }

    return cache.get(key);
  };
}

function bound(elementDescriptor) {
  const {
    kind,
    key,
    descriptor
  } = elementDescriptor;

  if (kind !== 'method') {
    throw Error('@bound decorator can only be used on methods');
  }

  const method = descriptor.value;
  const initializer = // check for private method
  typeof key === 'object' ? function () {
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
    key,
    placement: 'own',
    initializer,
    descriptor: { ...descriptor,
      value: undefined
    }
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


const ReadOnlyPropertiesMixin = superclass => {
  var _temp;
  /**
   * @type {Map<string, symbol>}
   * @private
   */


  const _readOnlyPropertyNamesMap = new Map();

  return _temp = class ReadOnlyPropertiesClass extends superclass {
    /**
     * @inheritdoc
     * @param  {string} name property name
     * @param  {AugmentedPropertyDeclaration} options augmented property declaration with optional `readOnly` boolean.
     */
    static createProperty(name, options) {
      let finalOptions = options;

      if (options.readOnly) {
        const privateName = Symbol(name);

        _readOnlyPropertyNamesMap.set(name, privateName);

        Object.defineProperty(this.prototype, name, {
          get() {
            return this[privateName];
          },

          set(value) {
            // allow for class field initialization

            /* istanbul ignore if */
            if (this._readOnlyPropertyInitializedMap.get(name)) return;
            this[privateName] = value;

            this._readOnlyPropertyInitializedMap.set(name, true);
          }

        });
        finalOptions = { ...options,
          noAccessor: true
        };
      }

      super.createProperty(name, finalOptions);
    }
    /**
     * @type {Map<string, boolean>}
     * @private
     */


    constructor() {
      super();

      _defineProperty(this, "_readOnlyPropertyInitializedMap", new Map());

      this._setPropEntry = this._setPropEntry.bind(this);
    }
    /**
     * Set read-only properties
     * @param  {Object<string, unknown>}  props
     * @private
     */


    async set(props) {
      await Promise.all(Object.entries(props).map(this._setPropEntry));
    }
    /**
     * @param {[string, unknown]} entry
     * @return {Promise<unknown>}
     * @private
     */


    _setPropEntry([name, newVal]) {
      // typescript... https://github.com/microsoft/TypeScript/issues/1863

      /** @type {any} */
      const privateName = _readOnlyPropertyNamesMap.get(name);

      const oldVal = this[privateName];
      this[privateName] = newVal;
      return this.requestUpdate(name, oldVal);
    }

  }, _temp;
};
/**
 * Remove an element from the DOM
 * @param {ChildNode} el
 * @return {void}
 */

/* istanbul ignore next */


const remove = el => el === null || el === void 0 ? void 0 : el.remove();

const appendTemplate = curry(function appendTemplate(template, target) {
  const tmp = document.createElement('div');
  render(template, tmp);
  const {
    firstElementChild
  } = tmp;
  target.appendChild(firstElementChild);
  tmp.remove();
  return firstElementChild;
});

const mapPropEntry = mapping => ([key, value]) => key in mapping && typeof mapping[key] === 'function' ? [key, mapping[key](value)] : [key, value];

const mapProps = mapping => obj => Object.fromEntries(Object.entries(obj).map(mapPropEntry(mapping)));

const mapDataset = f => ({
  dataset
}) => f(dataset);

const identity = x => x;
/** camelCase a string */


const camel = memoize(identity, camelCase);
/** dash-case a string */

const dash = memoize(identity, kebabCase);
/**
 * Generates a random mount point for Stripe Elements. This will allow multiple
 * Elements forms to be embedded on a single page.
 * @param {'STRIPE-ELEMENTS'|'STRIPE-PAYMENT-REQUEST'} tagName element tag name
 * @return {string} mount element id
 */

function generateRandomMountElementId(tagName) {
  return `${tagName.toLowerCase()}-mount-point-${(Date.now() + Math.random() * 1000).toString(36).substr(0, 8)}`;
}

const elem = xs => x => xs.includes(x);

const isRepresentation = elem(['paymentMethod', 'source', 'token']);
/**
 * Throws an error if the response is not OK.)
 * @param  {Response} response
 * @resolves {Response}
 * @rejects {Error}
 */

async function throwBadResponse(response) {
  const {
    ok,
    statusText
  } = response;
  if (!ok) throw new Error(statusText);
  return response;
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
  _getDecoratorsApi = function () {
    return api;
  };

  var api = {
    elementsDefinitionOrder: [["method"], ["field"]],
    initializeInstanceElements: function (O, elements) {
      ["method", "field"].forEach(function (kind) {
        elements.forEach(function (element) {
          if (element.kind === kind && element.placement === "own") {
            this.defineClassElement(O, element);
          }
        }, this);
      }, this);
    },
    initializeClassElements: function (F, elements) {
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
    defineClassElement: function (receiver, element) {
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
    decorateClass: function (elements, decorators) {
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
    addElementPlacement: function (element, placements, silent) {
      var keys = placements[element.placement];

      if (!silent && keys.indexOf(element.key) !== -1) {
        throw new TypeError("Duplicated element (" + element.key + ")");
      }

      keys.push(element.key);
    },
    decorateElement: function (element, placements) {
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
    decorateConstructor: function (elements, decorators) {
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
    fromElementDescriptor: function (element) {
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
    toElementDescriptors: function (elementObjects) {
      if (elementObjects === undefined) return;
      return _toArray(elementObjects).map(function (elementObject) {
        var element = this.toElementDescriptor(elementObject);
        this.disallowProperty(elementObject, "finisher", "An element descriptor");
        this.disallowProperty(elementObject, "extras", "An element descriptor");
        return element;
      }, this);
    },
    toElementDescriptor: function (elementObject) {
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
    toElementFinisherExtras: function (elementObject) {
      var element = this.toElementDescriptor(elementObject);

      var finisher = _optionalCallableProperty(elementObject, "finisher");

      var extras = this.toElementDescriptors(elementObject.extras);
      return {
        element: element,
        finisher: finisher,
        extras: extras
      };
    },
    fromClassDescriptor: function (elements) {
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
    toClassDescriptor: function (obj) {
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
    runClassFinishers: function (constructor, finishers) {
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
    disallowProperty: function (obj, name, objectType) {
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

  var isSameElement = function (other) {
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

  return typeof key === "symbol" ? key : String(key);
}

function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];

  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }

  return (hint === "string" ? String : Number)(input);
}

class StripeElementsError extends Error {
  constructor(tag, message) {
    super(`<${tag}>: ${message}`);
    this.originalMessage = message;
  }

}
/* istanbul ignore next */


const removeAllMounts = slotName => host => host.querySelectorAll(`[slot="${slotName}"][name="${slotName}"]`).forEach(remove);

const slotTemplate = slotName => html`<slot slot="${slotName}" name="${slotName}"></slot>`;

const mountPointTemplate = ({
  stripeMountId,
  tagName
}) => html`<div id="${ifDefined(stripeMountId)}" class="${tagName.toLowerCase()}-mount"></div>`;
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


let StripeBase = _decorate(null, function (_initialize, _ReadOnlyPropertiesMi) {
  class StripeBase extends _ReadOnlyPropertiesMi {
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
    constructor() {
      super();

      _initialize(this);

      this.slotName = `${this.tagName.toLowerCase()}-slot`;
    }
    /** @inheritdoc */


  }

  return {
    F: StripeBase,
    d: [{
      kind: "field",
      key: "billingDetails",

      value() {
        return {};
      }

    }, {
      kind: "field",
      key: "paymentMethodData",

      value() {
        return {};
      }

    }, {
      kind: "field",
      key: "sourceData",

      value() {
        return {};
      }

    }, {
      kind: "field",
      key: "tokenData",

      value() {
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

      value() {
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

      value() {
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

      value() {
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

      value() {
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

      value() {
        return false;
      }

    }, {
      kind: "field",
      decorators: [property({
        type: Object,
        readOnly: true
      })],
      key: "element",

      value() {
        return null;
      }

    }, {
      kind: "field",
      decorators: [property({
        type: Object,
        readOnly: true
      })],
      key: "elements",

      value() {
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
          toAttribute: error => !error ? null : error.originalMessage || error.message || ''
        }
      })],
      key: "error",

      value() {
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

      value() {
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

      value() {
        return false;
      }

    }, {
      kind: "field",
      decorators: [property({
        type: Object,
        readOnly: true
      })],
      key: "stripe",

      value() {
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

      value() {
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

      value() {
        return false;
      }

    }, {
      kind: "field",
      key: "shadowHosts",

      value() {
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
        const {
          error,
          showError,
          slotName
        } = this;
        const errorMessage = (error === null || error === void 0 ? void 0 : error.originalMessage) || (error === null || error === void 0 ? void 0 : error.message);
        return html` <div id="stripe" part="stripe"> <slot id="stripe-slot" name="${slotName}"></slot> </div> <output id="error" for="stripe" part="error" ?hidden="${!showError}"> ${ifDefined(errorMessage)} </output> `;
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
        [...changed.keys()].forEach(this.representationChanged);
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
      value: async function errorChanged() {
        // DEPRECATED
        const hasError = !!this.error;
        await this.set({
          hasError
        }); // END DEPRECATED

        this.resetRepresentations();
        this.fireError(this.error);
      }
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
      value: function fire(type, detail, opts = {}) {
        this.dispatchEvent(new CustomEvent(type, {
          detail,
          ...opts
        }));
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
          error
        })); // DEPRECATED

        this.dispatchEvent(new ErrorEvent('stripe-error', {
          bubbles: true,
          error
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
      value: async function handleResponse(response) {
        const {
          error = null,
          paymentMethod = null,
          source = null,
          token = null
        } = response;
        await this.set({
          error,
          paymentMethod,
          source,
          token
        });
        if (error) throw error;else return response;
      }
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
      value: async function init() {
        await this.unmount();
        await this.initStripe();
        await this.initElement();
        this.initElementListeners();
        this.destroyMountPoints();
        this.initMountPoints();
        this.mount();
      }
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
        let host = this;
        this.shadowHosts = [this];

        while (host = host.getRootNode().host) this.shadowHosts.push(host); // eslint-disable-line prefer-destructuring, no-loops/no-loops


        const {
          shadowHosts,
          slotName
        } = this; // Prepare the shallowest breadcrumb slot at document level

        const hosts = [...shadowHosts];
        const root = hosts.pop();

        if (!root.querySelector(`[slot="${slotName}"]`)) {
          const div = document.createElement('div');
          div.slot = slotName;
          root.appendChild(div);
        }

        const container = root.querySelector(`[slot="${slotName}"]`); // Render the form to the document, so that Stripe.js can mount

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
      value: async function initStripe() {
        const {
          publishableKey
        } = this;
        const stripe = window.Stripe && publishableKey ? Stripe(publishableKey) : null;
        const elements = stripe && stripe.elements();
        const error = stripe ? null : this.createError('requires Stripe.js to be loaded first.');
        if (error) console.warn(error.message); // eslint-disable-line no-console

        await this.set({
          elements,
          error,
          stripe
        });
      }
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
      value: async function unmount() {
        var _this$element5;

        (_this$element5 = this.element) === null || _this$element5 === void 0 ? void 0 : _this$element5.unmount();
        await this.set({
          element: null
        });
      }
      /**
       * @param  {StripeFocusEvent} event
       * @private
       */

    }, {
      kind: "method",
      decorators: [bound],
      key: "onBlur",
      value: async function onBlur() {
        await this.set({
          focused: false
        });
      }
      /**
       * @param  {StripeFocusEvent} event
       * @private
       */

    }, {
      kind: "method",
      decorators: [bound],
      key: "onFocus",
      value: async function onFocus() {
        await this.set({
          focused: true
        });
      }
      /**
       * Sets the `ready` property when the stripe element is ready to receive focus.
       * @param  {Event} event
       * @private
       */

    }, {
      kind: "method",
      decorators: [bound],
      key: "onReady",
      value: async function onReady(event) {
        await this.set({
          ready: true,
          stripeReady: true
        });
        this.fire('ready', event); // DEPRECATED

        this.fire('stripe-ready', event);
      }
      /**
       * POSTs the payment info represenation to the endpoint at `/action`
       * @resolves {void}
       * @private
       */

    }, {
      kind: "method",
      key: "postRepresentation",
      value: async function postRepresentation() {
        const onError = error => this.set({
          error
        });

        const onSuccess = success => {
          this.fire('success', success); // DEPRECATED

          this.fire('stripe-payment-success', success);
        };

        const token = this.token || undefined;
        const source = this.source || undefined;
        const paymentMethod = this.paymentMethod || undefined;
        const body = JSON.stringify({
          token,
          source,
          paymentMethod
        });
        const headers = {
          'Content-Type': 'application/json'
        };
        const method = 'POST';
        return fetch(this.action, {
          body,
          headers,
          method
        }).then(throwBadResponse).then(onSuccess).catch(onError);
      }
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
        const value = this[name];
        /* istanbul ignore if */

        if (!value) return; // DEPRECATED

        this.fire(`stripe-${dash(name)}`, value);
        this.fire(`${dash(name)}`, value);
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
}, ReadOnlyPropertiesMixin(LitNotify(LitElement)));
/** @typedef {stripe.PaymentIntentResponse|stripe.PaymentMethodResponse|stripe.SetupIntentResponse|stripe.TokenResponse|stripe.SourceResponse} PaymentResponse */

/** @typedef {{ owner: stripe.OwnerData }} SourceData */

/** @typedef {{ elementType: stripe.elements.elementsType }} StripeFocusEvent */


var sharedStyles = css$1`[hidden]{display:none!important}:host{display:block;box-sizing:border-box}#error{font-family:sans-serif;font-size:14px;padding-left:42px;padding-bottom:10px}`;

const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));

const isString = x => typeof x === 'string';

const trim = s => s.trim();

const isObject = x => x !== null && `${x}` === '[object Object]';

const replace = (...args) => s => s.replace(...args);

const isAllStrings = xs => Array.isArray(xs) && xs.every(isString);

const fromEntries = xs => Object.fromEntries ? Object.fromEntries(xs) : xs.reduce((o, [k, v]) => Object.assign({
  [k]: v
}, o), {});

const flatMap = f => xs => 'flatMap' in Array.prototype ? xs.flatMap(f) : xs.reduce((acc, x) => acc.concat(f(x)), []);

const pick = (keys, element) => keys.reduce((pojo, key) => Object.assign(pojo, {
  [key]: element[key]
}), {});

const stripUndefinedVals = flatMap(([k, v]) => v === undefined ? [] : [[k, v]]);
const stripUndefined = compose(fromEntries, stripUndefinedVals, Object.entries);

const mark = x => x instanceof Element ? `<mark class='string'>${x.outerHTML.replace(/</g, '&lt;').replace(/"/g, '\'')}</mark>` : isObject(x) || Array.isArray(x) ? x : `<mark class='${x === null ? 'null' : typeof x}'>${x}</mark>`;

const replacer = (k, v) => k === '' ? v : mark(v);

const pretty = o => JSON.stringify(o, replacer, 2);

const markKeys = replace(/"(.*)":/g, (_, key) => `<mark class="key">"${key}"</mark>:`);
const wrapStrings = replace(/"<mark(.*)>(.*)<\/mark>"/g, (_, attrs, content) => `<mark${attrs}>${attrs.includes('string') ? `"${content}"` : content}</mark>`);
const json = compose(wrapStrings, markKeys, pretty, stripUndefined);
const css = `
[hidden],
:host([hidden]) {
  display: none !important;
}

:host {
  display: block;
  position: relative;
  color: var(--json-viewer-color, currentColor);
  background: var(--json-viewer-background);
}

mark { background: none; }
mark.key { color: var(--json-viewer-key-color); }
mark.boolean { color: var(--json-viewer-boolean-color); }
mark.number { color: var(--json-viewer-number-color); }
mark.null { color: var(--json-viewer-null-color); }
mark.string { color: var(--json-viewer-string-color); }

@media (prefers-color-scheme: dark), (prefers-color-scheme: no-preference) {
  :host {
    --json-viewer-color: white;
    --json-viewer-background: #212529;
    --json-viewer-key-color: #ff922b;
    --json-viewer-boolean-color: #22b8cf;
    --json-viewer-number-color: #51cf66;
    --json-viewer-null-color: #ff6b6b;
    --json-viewer-string-color: #22b8cf;
  }
}

@media (prefers-color-scheme: light) {
  :host {
    --json-viewer-color: #212529;
    --json-viewer-background: white;
    --json-viewer-key-color: #f76707;
    --json-viewer-boolean-color: #0c8599;
    --json-viewer-number-color: #0ca678;
    --json-viewer-null-color: #e03131;
    --json-viewer-string-color: #0c8599;
  }
}
`;
const template = document.createElement('template');
template.innerHTML = `
<code hidden>
  <pre></pre>
</code>
`;
const WLATTR = 'whitelist';
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

class JsonViewer extends HTMLElement {
  static get is() {
    return 'json-viewer';
  }

  static get observedAttributes() {
    return [WLATTR];
  }
  /**
   * Object to display
   * @type {object}
   */


  get object() {
    return this.__object;
  }

  set object(val) {
    this.__object = val;
    this.render();
  }
  /**
   * Whitelist of keys for the object.
   * Required if setting `object` to a non-serializable object (e.g. an HTMLElement)
   * @type {string[]}
   * @attr
   */


  get whitelist() {
    return this.__whitelist;
  }

  set whitelist(val) {
    if (!isAllStrings(val)) {
      throw new Error('whitelist must be an array of strings');
    }

    this.__whitelist = val;
    const attr = val.join(',');
    this.setAttribute(WLATTR, attr);
    this.render();
  }

  constructor() {
    super();
    this.__mo = new MutationObserver(this.parse.bind(this));

    this.__mo.observe(this, {
      subtree: false,
      characterData: true
    });

    this.attachShadow({
      mode: 'open'
    });

    if ('adoptedStyleSheets' in Document.prototype) {
      const styles = new CSSStyleSheet();
      styles.replaceSync(css);
      this.shadowRoot.adoptedStyleSheets = [styles];
    } else {
      this.shadowRoot.innerHTML = `<style>${css}</style>`;
    }

    this.shadowRoot.append(template.content.cloneNode(true));
  }

  attributeChangedCallback(_, __, whitelist) {
    this.whitelist = whitelist.split(',').map(trim);
  }

  connectedCallback() {
    this.parse();
  }
  /**
   * @private
   * @return {string} syntax-highlighted HTML string
   */


  getHighlightedDomString() {
    const {
      whitelist,
      object
    } = this;
    return object === undefined ? '' : json(whitelist ? pick(whitelist, object) : object);
  }
  /** @private */


  render() {
    const highlighted = this.getHighlightedDomString();
    this.shadowRoot.querySelector('code').hidden = !highlighted;
    this.shadowRoot.querySelector('pre').innerHTML = highlighted;
  }
  /** @private */


  parse() {
    if (!this.textContent.trim()) return;

    try {
      this.object = JSON.parse(this.textContent);
    } catch (_) {
      this.object = undefined;
    }
  }

}
customElements.define(JsonViewer.is, JsonViewer);

const identity$1 = x => x;
/** camelCase a string */


const camel$1 = memoize(identity$1, camelCase);

const $ = x => document.querySelector(x);
const $$ = x => [...document.querySelectorAll(x)];

const compose$1 = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));

const LS_KEYS = Object.freeze({
  publishableKey: '__STRIPE_PUBLISHABLE_KEY__',
  clientSecret: '__STRIPE_CLIENT_SECRET__'
});
const publishableKey = localStorage.getItem(LS_KEYS.publishableKey) || 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX';

const setProp = (prop, value) => el => el[prop] = value;

const storePublishableKey = publishableKey => {
  localStorage.setItem(LS_KEYS.publishableKey, publishableKey);
  return publishableKey;
};

const setProps = propName => selector => ({
  target: {
    value
  }
}) => {
  $$(selector).forEach(setProp(propName, value));
  return value;
};

const setKeys = x => compose$1(storePublishableKey, setProps('publishableKey')(x));
const setClientSecrets = setProps('clientSecret');

const fieldEntry = field => [field.dataset.ownerProp, field.value];

const shared = css$1`[hidden]{display:none!important}:host{align-items:center;display:grid;grid-gap:12px}#stripe{display:contents}::slotted([publishable-key]){grid-area:stripe}`;

class DemoBase extends LitElement {
  static get properties() {
    return {
      output: {
        type: Object
      }
    };
  }

  get stripe() {
    return this.querySelector(this.constructor.selector);
  }

  constructor() {
    super();
    this.display = this.display.bind(this);
  }

  attachStripeListeners() {
    this.stripe.addEventListener('success', this.display);
    this.stripe.addEventListener('fail', this.display);
  }

  removeStripeListeners() {
    this.stripe.removeEventListener('success', this.display);
    this.stripe.removeEventListener('fail', this.display);
  }

  connectedCallback() {
    super.connectedCallback();
    const mo = new MutationObserver(this.attachStripeListeners);
    mo.observe(this, {
      childList: true
    });
    this.attachStripeListeners();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeStripeListeners();
  }

  display({
    target
  }) {
    const val = target[camel$1(target.generate)];
    this.output = val;
  }

}

customElements.define('elements-demo', class ElementsDemo extends DemoBase {
  static get properties() {
    return {
      submitDisabled: {
        type: Boolean
      },
      label: {
        type: String
      }
    };
  }

  static get styles() {
    return [shared, css$1`:host{grid-template-areas:'stripe stripe' 'fields fields'}#actions{display:contents}`];
  }

  static get selector() {
    return 'stripe-elements';
  }

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.submitDisabled = true;
    const stripe = this.querySelector(this.constructor.selector);
    if (!stripe) return;
  }

  attachStripeListeners() {
    super.attachStripeListeners();
    this.stripe.addEventListener('change', this.onChange);
  }

  removeStripeListeners() {
    super.removeStripeListeners();
    this.stripe.removeEventListener('change', this.onChange);
  }

  validate() {
    return this.stripe.validate();
  }

  get billingDetails() {
    const slot = this.shadowRoot.querySelector('slot[name="actions"]');
    const assigned = slot.assignedElements();
    const elements = assigned.length ? assigned : [...slot.children];
    return Object.fromEntries(elements.map(fieldEntry));
  }

  render() {
    return html` <div id="stripe" ?hidden="${this.output}"> <slot></slot> </div> <div id="actions" ?hidden="${this.output}"> <slot name="actions"> <mwc-textfield outlined label="Cardholder Name" data-owner-prop="name" value="Mr. Man"> </mwc-textfield> <mwc-textfield outlined label="Cardholder Email" data-owner-prop="email" value="mr@man.email"> </mwc-textfield> <mwc-textfield outlined label="Cardholder Phone" data-owner-prop="phone" value="555 555 5555"> </mwc-textfield> <mwc-button ?disabled="${this.submitDisabled}" outlined @click="${this.onClickSubmit}">${this.label}</mwc-button> </slot> </div> <json-viewer .object="${this.output}"> </json-viewer> `;
  }

  async onClickSubmit() {
    const [element] = this.shadowRoot.querySelector('#stripe slot').assignedElements();
    element.billingDetails = this.billingDetails;
    this.output = await element.submit();
  }

  onChange({
    target: {
      isComplete
    }
  }) {
    this.submitDisabled = !isComplete;
  }

});
customElements.define('payment-request-demo', class PaymentRequestDemo extends DemoBase {
  static get styles() {
    return [shared, css$1`:host{grid-template-areas:'stripe' 'output'}`];
  }

  static get selector() {
    return 'stripe-payment-request';
  }

  render() {
    return html` <div id="stripe" ?hidden="${this.output}"><slot></slot></div> <json-viewer .object="${this.output}"> </json-viewer> `;
  }

});

export { $, LitNotify as L, StripeBase as S, _get as _, _getPrototypeOf as a, bound as b, setKeys as c, dash as d, camel as e, mapProps as f, setClientSecrets as g, mapDataset as m, publishableKey as p, sharedStyles as s };
//# sourceMappingURL=storybook-helpers-bff92679.js.map
