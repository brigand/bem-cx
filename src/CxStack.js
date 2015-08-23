import cx from './';
const warns = {};

export default
class CxStack {
  /**
    new CxStack(rootClassName)

    Creates a new stack. This can be done either in render() or at the top of the file.
  **/
  constructor(...args){
    const bem = cx(...args);

    this.level = 0;
    this.stack = [bem];
  }

  /**
    Updates the stack's internal state to have `level+1` items.

    The first call to this should pass `1` as the level.

    `args` are passed to bem.el. Returns a BemElement.
  **/
  elAt(level, ...args){
    const change = level - this.level;
    if (process.env.DEBUG) {
      console.error({
        levelFrom: this.level,
        levelTo: level,
        change: change,
        stackLength: this.stack.length,
        stackStr: this.stack.map(x => String(x))
      });
    }

    // push `change` new frames
    if (change > 0) {
      const rootId = this.stack[0].toString();

      // we're pushing the current element multiple times because information is missing
      for (let i=0; i<change; i++) {
        // this is how we handle jumps
        // essentially it acts as if you didn't jump, so 1, 3, 2 behaves like 1, 2, 2
        // maybe there's some edge case I haven't thought of
        // FIXME: simplify?
        if (i < change - 1) {
          this.stack.push(this._getBem(0));
        }

        // the normal case
        else {
          this.stack.push(this._getBem(0).el(...args));
        }

        this.level++;
      }

      // show a warning if it's jumping elements
      if (change > 1 && !warns[rootId]) {
        console.warn(
          `bem-cx CxStack: The stack advanced ${change} steps at once.  `
          + `From "${rootId}" to "${this._getBem(0)}"`
        );
        warns[rootId] = true;
      }

      return this._getBem(0);
    }

    // stay still
    else if (change === 0){
      // note: this is the one place we use non-zero offset
      // if `change` is 0 then it's a sibling
      const bem = this._getBem(-1);
      const next = bem.el(...args);

      // replace the top item
      this.stack[this.stack.length - 1] = next;
      return next;
    }

    // go back `change` steps
    else if (change < 0){
      for (let i=change; i<=0; i++) {
        this.level--;
        this.stack.pop();
      }

      return this._getBem(0).el(...args);
    }
  }


  /** Same as the regular bem **/
  mod(...args){ return this._getBem(0).mod(...args); }

  /** Same as the regular bem **/
  el(...args){ return this._getBem(0).el(...args); }

  /** Same as the regular bem **/
  toString(...args){ return this._getBem(0).toString(); }

  /**
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

  **/
  makeRelative(el=undefined){
    const it = new CxStack(this._getBem(0).toString());
    return it;
  }


  _getBem(offset){
    return this.stack[this.level + offset];
  }
}
