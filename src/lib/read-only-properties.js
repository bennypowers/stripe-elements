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
export const ReadOnlyPropertiesMixin = superclass => {
  /**
   * @type {Map<string, symbol>}
   * @private
   */
  const _readOnlyPropertyNamesMap = new Map();

  return class ReadOnlyPropertiesClass extends superclass {
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
          },
        });

        finalOptions = { ...options, noAccessor: true };
      }

      super.createProperty(name, finalOptions);
    }

    /**
     * @type {Map<string, boolean>}
     * @private
     */
    _readOnlyPropertyInitializedMap = new Map();

    constructor() {
      super();
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
  };
};
