/**
  Returns a BemElement
**/
export default function makeBemElement(root){
  return new BemElement(root);
}
export {default as CxStack} from './CxStack';

export class BemElement {
  constructor(name, modifiers=[], parent){
    if (parent) {
      this.name = name;
    }
    else {
      const match = name.replace(/^.*\/|\.[a-zA-Z0-9]+$/g, '');
      this.name = match ? match : name;
    }
    this.modifiers = modifiers;
    this.parent = parent;
  }

  /**
    Returns a BemElement with `name` as a subelement.

    ```js
    String(bem.el('Bar')) === 'Foo__Bar';
    ```
  **/
  el(name){
    return new BemElement(this.name + '__' + name, this.modifiers, this);
  }

  /**
    If passed a falsy value, it returns itself.

    If passed a non-empty string it returns a BemElement with that string
    as a modifier. You can have any number of modifiers.

    If it's passed an object, it defers to `.modObj`. See below.

    ```js
    var bem = makeBemElement('Foo');
    String(bem.el('Bar').mod('baz')) === 'Foo__Bar Foo__Bar--baz';
    ```

    If you pass a second argument, it'll be used as the truthy test.

    ```js
    String(bem.mod('baz', false)) === 'Foo';
    ```
  **/
  mod(modName, _condition=true){
    const condition = arguments.length === 2 ? !!_condition : true;

    if (!modName || !condition) {
      return this;
    }

    if (typeof modName === 'object') {
      return this.modObj(modName);
    }

    return new BemElement(this.name, this.modifiers.concat([modName]), this);
  }

  /**
    Like `.mod` but uses the keys of the first argument as modifier names,
    and the values as truthy tests.

    ```js
    String(bem.modObj({baz: false, quux: true})) === 'Foo--quux'
    ```

    Why is this public? Performance. Passing strings to a function sometimes,
    and objects other times throws off JITs and they may deoptimize the function.

    You can decide if that matters to you; the performance gain is likely small.
  **/
  modObj(mods){
    return Object.keys(mods).reduce((m, key) => {
        return m.mod(key, mods[key]);
    }, this);
  }

  _getModifiers(){
    const modifiers = this.modifiers.map((mod) => {
      return this.name + '--' + mod;
    });

    return modifiers;
  }

  /**
    When coerced to a string you get a space seperated list of class names.

    This happens automatically when passing it to `className={}` in React. You may
    need to force coersion in other cases.

    ```js
    String(bem) === 'Foo';
    bem.toString() === 'Foo';
    '' + bem === 'Foo';
    ```
  **/
  toString(){
    return [this.name].concat(this._getModifiers()).join(' ');
  }
}
