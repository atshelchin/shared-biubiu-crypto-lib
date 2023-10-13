import test from 'ava';

import { toAptosAddress, toSUIAddress, toTronAddress } from '../lib/utils.js';

test('toSUIAddress2', (t) => {
  console.log(toSUIAddress());
  console.log(toAptosAddress());
  t.is(1, 1);
});

test('toSUIAddress22', (t) => {
  console.log(toTronAddress());
  t.is(1, 1);
});
