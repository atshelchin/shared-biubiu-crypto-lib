import { ed25519 } from '@noble/curves/ed25519';
import test from 'ava';

import Ed25519 from '../lib/Ed25519.js';
import { areUint8ArraysEqual } from '../lib/utils.js';

test('generateKeyPair', (t) => {
  const instance = new Ed25519();
  const res = instance.generateKeyPair();
  t.is(areUint8ArraysEqual(res[1], ed25519.getPublicKey(res[0])), true);
});

test('generateKeyPairFromPrivkey', (t) => {
  const instance = new Ed25519();
  const res = instance.generateKeyPairFromPrivkey(
    new Uint8Array([
      88, 103, 130, 127, 121, 233, 9, 70, 180, 193, 248, 46, 115, 245, 214, 32,
      38, 59, 70, 215, 248, 137, 43, 249, 149, 122, 104, 197, 45, 233, 98, 154,
    ]),
  );

  const pubkey = new Uint8Array([
    147, 248, 141, 123, 247, 249, 239, 33, 8, 76, 9, 226, 247, 180, 182, 217,
    50, 9, 31, 163, 247, 216, 68, 25, 121, 180, 39, 143, 135, 21, 191, 77,
  ]);

  t.is(areUint8ArraysEqual(res[1], pubkey), true);
});

test('generateSharedSecret', (t) => {
  const privatekey1 = new Uint8Array([
    176, 232, 250, 117, 58, 21, 165, 133, 204, 126, 48, 52, 77, 253, 153, 21,
    115, 9, 12, 84, 32, 72, 44, 202, 206, 207, 86, 63, 162, 50, 87, 77,
  ]);
  // x25519 pubkey not ed25519 pubkey
  const pubkey1 = new Uint8Array([
    14, 247, 135, 183, 238, 152, 140, 112, 148, 46, 192, 155, 164, 235, 88, 17,
    137, 185, 191, 205, 104, 240, 36, 172, 1, 124, 27, 38, 251, 203, 184, 0,
  ]);

  const privatekey2 = new Uint8Array([
    88, 103, 130, 127, 121, 233, 9, 70, 180, 193, 248, 46, 115, 245, 214, 32,
    38, 59, 70, 215, 248, 137, 43, 249, 149, 122, 104, 197, 45, 233, 98, 154,
  ]);

  // x25519 pubkey not ed25519 pubkey
  const pubkey2 = new Uint8Array([
    124, 142, 89, 185, 97, 0, 34, 130, 160, 5, 157, 242, 235, 158, 120, 48, 3,
    29, 95, 247, 78, 108, 224, 88, 211, 22, 68, 102, 129, 48, 195, 12,
  ]);

  const instance = new Ed25519();

  const secret1 = instance.generateSharedSecret(pubkey2, privatekey1);
  const secret2 = instance.generateSharedSecret(pubkey1, privatekey2);

  t.is(areUint8ArraysEqual(secret1, secret2), true);
});

test('sign-verify', (t) => {
  const message = new Uint8Array(32).fill(1);
  const privatekey = new Uint8Array([
    88, 103, 130, 127, 121, 233, 9, 70, 180, 193, 248, 46, 115, 245, 214, 32,
    38, 59, 70, 215, 248, 137, 43, 249, 149, 122, 104, 197, 45, 233, 98, 154,
  ]);
  const pubkey = new Uint8Array([
    147, 248, 141, 123, 247, 249, 239, 33, 8, 76, 9, 226, 247, 180, 182, 217,
    50, 9, 31, 163, 247, 216, 68, 25, 121, 180, 39, 143, 135, 21, 191, 77,
  ]);

  const instance = new Ed25519();
  const signature = instance.sign(message, privatekey);

  t.is(instance.verify(signature, message, pubkey), true);
});

test('getHDKey', (t) => {
  const instance = new Ed25519();
  // secret passphrase: 223
  const mnemonic =
    'finger plug meadow swamp filter object second vintage embrace correct knee bullet deposit film fish involve route sustain embark broccoli cable reveal oyster panda';
  const HDKey = instance.getHDKey(mnemonic);

  const hdkey = HDKey.derive(`m/44'/637'/0'/0'/5'`);
  const pk = new Uint8Array([
    8, 126, 233, 231, 221, 159, 9, 82, 69, 150, 217, 145, 88, 50, 5, 175, 195,
    157, 71, 84, 10, 122, 229, 48, 98, 196, 99, 80, 16, 217, 119, 68,
  ]);
  t.is(areUint8ArraysEqual(hdkey.privateKey, pk), true);
});

test('deriveFromSeed', (t) => {
  const instance = new Ed25519();
  const mnemonic =
    'finger plug meadow swamp filter object second vintage embrace correct knee bullet deposit film fish involve route sustain embark broccoli cable reveal oyster panda';
  const pair = instance.deriveFromSeed(mnemonic, `m/44'/637'/0'/0'/5'`);
  const pk = new Uint8Array([
    8, 126, 233, 231, 221, 159, 9, 82, 69, 150, 217, 145, 88, 50, 5, 175, 195,
    157, 71, 84, 10, 122, 229, 48, 98, 196, 99, 80, 16, 217, 119, 68,
  ]);
  const res = instance.generateKeyPairFromPrivkey(pk);
  t.is(
    areUint8ArraysEqual(pair[0], pk) && areUint8ArraysEqual(pair[1], res[1]),
    true,
  );
});

test('deriveFromHDkey', (t) => {
  const instance = new Ed25519();
  const mnemonic =
    'finger plug meadow swamp filter object second vintage embrace correct knee bullet deposit film fish involve route sustain embark broccoli cable reveal oyster panda';
  const HDKey = instance.getHDKey(mnemonic);

  const pair = instance.deriveFromHDkey(HDKey, `m/44'/637'/0'/0'/5'`);
  const pk = new Uint8Array([
    8, 126, 233, 231, 221, 159, 9, 82, 69, 150, 217, 145, 88, 50, 5, 175, 195,
    157, 71, 84, 10, 122, 229, 48, 98, 196, 99, 80, 16, 217, 119, 68,
  ]);

  const res = instance.generateKeyPairFromPrivkey(pk);
  t.is(
    areUint8ArraysEqual(pair[0], pk) && areUint8ArraysEqual(pair[1], res[1]),
    true,
  );
});
