import test from 'tape';
import {CxStack} from '../src';

test('bem-cx', (t) => {

  t.test('basics', (t) => {
    const {eq, cxs, end} = getTest(t);
    const elAt = (x, y, str) => {
      const el = cxs.elAt(x, y)
      t.comment(`${Array(x*4).fill(' ').join('')}.elAt(${x}, ${y}) === ${""+el} === ${str}`);
      eq(el, str);
    }

    eq(cxs, 'Root');
    elAt(1, 'A', 'Root__A');
    elAt(2, 'B', 'Root__A__B');
    elAt(1, 'C', 'Root__C');
    elAt(1, 'D', 'Root__D');
    elAt(1, 'E', 'Root__E');
    elAt(2, 'F', 'Root__E__F');
    elAt(3, 'G', 'Root__E__F__G');

    end();
  });

  t.test('skip', (t) => {
    const {eq, cxs, end} = getTest(t);
    const elAt = (x, y, str) => {
      const el = cxs.elAt(x, y)
      t.comment(`${Array(x*4).fill(' ').join('')}.elAt(${x}, ${y}) === ${""+el} === ${str}`);
      eq(el, str);
    }

    elAt(1, 'Foo', 'Root__Foo');
    elAt(3, 'Bar', 'Root__Foo__Bar');
    elAt(2, 'Baz', 'Root__Foo__Baz');

    end();
  });

  t.test('pass through', (t) => {
    const {cxs, end} = getTest(t);
    cxs.elAt(1, 'Foo');
    t.test('toString', (t) => {
      t.equal(cxs.toString(), 'Root__Foo');
      t.equal(cxs.toString(), 'Root__Foo');
      t.end();
    });

    t.test('el', (t) => {
      t.equal(cxs.el('Baz').toString(), 'Root__Foo__Baz');
      t.equal(cxs.el('Baz').toString(), 'Root__Foo__Baz');
      t.end();
    });

    t.test('mod', (t) => {
      t.equal(cxs.mod('baz').toString(), 'Root__Foo Root__Foo--baz');
      t.equal(cxs.mod('baz').toString(), 'Root__Foo Root__Foo--baz');
      t.end();
    });

    end();
  });
});

function getTest(t) {
  return {
    eq: (a, b) => t.equal(String(a), String(b)),
    cxs: new CxStack('Root'),
    end: () => {
      t.end();
    }
  }
}
