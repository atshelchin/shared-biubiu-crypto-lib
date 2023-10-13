import test from 'ava';

import Ed25519 from '../lib/Ed25519.js';

test('generateMnemonic-24', (t) => {
  const instance = new Ed25519();
  const mnemonic = instance.generateMnemonic(24);
  t.is(mnemonic.split(' ').length, 24);
});

test('generateMnemonic-12', (t) => {
  const instance = new Ed25519();
  const mnemonic = instance.generateMnemonic(12);
  t.is(mnemonic.split(' ').length, 12);
});

test('mnemonicToSeedSync', (t) => {
  const instance = new Ed25519();
  const mnemonic =
    'finger plug meadow swamp filter object second vintage embrace correct knee bullet deposit film fish involve route sustain embark broccoli cable reveal oyster panda';

  const seed = instance.mnemonicToSeedSync(mnemonic);
  t.is(seed instanceof Uint8Array && seed.length === 64, true);
});
test('validateMnemonic-valid', (t) => {
  const instance = new Ed25519();
  const mnemonic =
    'finger plug meadow swamp filter object second vintage embrace correct knee bullet deposit film fish involve route sustain embark broccoli cable reveal oyster panda';

  t.is(instance.validateMnemonic(mnemonic), true);
});
test('validateMnemonic-invalid', (t) => {
  const instance = new Ed25519();
  const mnemonic =
    'plug finger meadow swamp filter object second vintage embrace correct knee bullet deposit film fish involve route sustain embark broccoli cable reveal oyster panda';

  t.is(instance.validateMnemonic(mnemonic), false);
});
test('getMnemonic-24', async (t) => {
  const instance = new Ed25519();
  const mnemonic =
    'finger plug meadow swamp filter object second vintage embrace correct knee bullet deposit film fish involve route sustain embark broccoli cable reveal oyster panda';

  const mnemonic2 = await instance.getMnemonic('223', 24);
  t.is(mnemonic2, mnemonic);
});

test('getMnemonic-12', async (t) => {
  const instance = new Ed25519();
  const mnemonic =
    'bacon wisdom favorite give lottery relax mouse trend window typical smooth buddy';

  const mnemonic2 = await instance.getMnemonic('223', 12);
  t.is(mnemonic2, mnemonic);
});
