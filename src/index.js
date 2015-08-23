/**
  Returns a BemElement
**/
export default function cx(root){
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

  el(name){
    return new BemElement(this.name + '__' + name, this.modifiers, this);
  }

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

  toString(){
    return [this.name].concat(this._getModifiers()).join(' ');
  }
}
