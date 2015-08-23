import test from 'tape';
import cx from '../src';

test('bem-cx', (t) => {
  var makeEqStr = (t) => (a, b) => t.equal(String(a), String(b));

  t.test('blocks', (t) => {
    var eq = makeEqStr(t);
    eq(cx('Foo'), 'Foo');
    t.end();
  });

  t.test('block from __filename', (t) => {
    var eq = makeEqStr(t);
    eq(cx(__filename), 'main');
    t.end();
  });

  t.test('block with modifier', (t) => {
    var eq = makeEqStr(t);
    eq(cx('Foo').mod({bar: true}), 'Foo Foo--bar');
    eq(cx('Foo').mod({bar: true, baz: true}), 'Foo Foo--bar Foo--baz');
    eq(cx('Foo').mod({bar: true, baz: true, quux: false}), 'Foo Foo--bar Foo--baz');

    eq(cx('Foo').mod('bar'), 'Foo Foo--bar');
    eq(cx('Foo').mod('bar').mod('baz'), 'Foo Foo--bar Foo--baz');

    eq(cx('Foo').mod('bar').mod(false).mod('baz'), 'Foo Foo--bar Foo--baz');
    eq(cx('Foo').mod('bar').mod(0).mod('baz'), 'Foo Foo--bar Foo--baz');
    eq(cx('Foo').mod('bar').mod('').mod('baz'), 'Foo Foo--bar Foo--baz');
    eq(cx('Foo').mod('bar').mod(null).mod('baz'), 'Foo Foo--bar Foo--baz');
    eq(cx('Foo').mod('bar').mod(undefined).mod('baz'), 'Foo Foo--bar Foo--baz');

    eq(cx('Foo').el('Bar').mod('bar').mod(undefined).mod('baz'), 'Foo__Bar Foo__Bar--bar Foo__Bar--baz');
    t.end();
  });

  t.test('sub blocks', (t) => {
    var eq = makeEqStr(t);
    eq(cx('Foo').el('Bar').el('Baz'), 'Foo__Bar__Baz');

    // behavior intentionally unspecified
    // eq(cx('Foo').el('Bar').mod('test').el('Baz'), 'Foo__Bar__Baz');
    // eq(cx('Foo').el('Bar').mod('test').el('Baz'), 'Foo__Bar__Baz--test');
    t.end();
  });
});
