bem-cx is designed for generating css classNames for use primarily in react components. It doesn't depend on react,
so you could use it elsewhere.

## Install

```sh
npm install bem-cx
```

## Docs

The docs can be found in the [docs](docs) directory, though they might not make sense without the examples below.

## Example

There are two flavors of bem-cx. The first is very simple but requires more typing. The example is in JSX.

```xml
import makeBem from 'bem-cx'; // or require('bem-cx').default
const bem = makeBem('Foo');

class Foo {
  render(){
      return (
        <div className={bem}>
          Foo
          <div className={bem.el('Header')}>
            Foo__Header
            <div className={bem.el('Header').el('Title')}>
              Foo__Header__Title
            </div>
          </div>
          <div className={bem.el('Content')}>
            <div className={bem.el('Content').el('Example').mod(true && 'active')}>
              Foo__Content__Example Foo__Content__Example--active
            </div>
            <div className={bem
              .el('Content')
              .el('Example')
              .mod({
                a: true,
                b: false,
                c: false
              })}
              >
              Foo__Content__Example
              Foo__Content__Example--a
              Foo__Content__Example--c
            </div>
          </div>
        </div>
      );
  }
}
```
This is the same as above but uses CxStack. CxStack has the same
api as the above but also provides `.elAt` takes a level as its first argument.

Level 0 is the root, so direct children of the root node will have the level 1.

This saves you from needing to type everything on the hierarchy for each element.
Aside from `.mod` this is the main value proposition of this library.

```xml
import {CxStack} from 'bem-cx'; // or require('bem-cx').CxStack

class Foo {
  render(){
      const bem = new CxStack('Foo');
      return (
        <div className={bem}>
          Foo
          <div className={bem.elAt(1, 'Header')}>
            Foo__Header
            <div className={bem.elAt(2, 'Title')}>
              Foo__Header__Title
            </div>
          </div>
          <div className={bem.elAt(1, 'Content')}>
            <div className={bem.elAt(2, 'Example').mod(true && 'active')}>
              Foo__Content__Example Foo__Content__Example--active
            </div>
            <div className={bem
              .elAt(2, 'Example')
              .mod({
                a: true,
                b: false,
                c: false
              })}
              >
              Foo__Content__Example
              Foo__Content__Example--a
              Foo__Content__Example--c
            </div>
          </div>
        </div>
      );
  }
}
```
