## class CxStack {

### `.constructor(...args)`

new CxStack(rootClassName)

Creates a new stack. This can be done either in render() or at the top of the file.


### `.elAt(level, ...args)`

Updates the stack's internal state to have `level+1` items.

The first call to this should pass `1` as the level.

`args` are passed to bem.el. Returns a BemElement.


### `.mod(...args){ return this._getBem(0).mod(...args); }`

Same as the regular bem

### `.el(...args){ return this._getBem(0).el(...args); }`

Same as the regular bem

### `.toString(...args){ return this._getBem(0).toString(); }`

Same as the regular bem

### `.makeRelative(el=undefined)`

Creates a version of this stack with the current block path as the root.

```js
render(){
  return (
    <div className={cxs.elAt(1, 'Foo')}>
      {this.renderItem(cxs.elAt(2, 'Bar').makeRelative(), 'Hello')}
    </div>
  );
}
renderItem(){
  String(cxs.elAt(1, 'Baz')) === 'Foo__Bar__Baz';
}
```

