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
    elAt(1, 'Foo', 'Root__Foo');
    elAt(2, 'Bar', 'Root__Foo__Bar');
    elAt(1, 'Baz', 'Root__Baz');
    elAt(1, 'Foo', 'Root__Foo');
    elAt(1, 'Foo', 'Root__Foo');
    elAt(2, 'Bar', 'Root__Foo__Bar');
    elAt(3, 'Baz', 'Root__Foo__Bar__Baz');

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
