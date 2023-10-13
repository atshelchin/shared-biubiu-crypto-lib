import { secp256k1 as secp } from '@noble/curves/secp256k1';
import test from 'ava';

import Secp256k1 from '../lib/Secp256k1.js';
import { areUint8ArraysEqual } from '../lib/utils.js';

test('generateKeyPair', (t) => {
  const secp256k1 = new Secp256k1();
  const res = secp256k1.generateKeyPair();

  t.is(areUint8ArraysEqual(res[1], secp.getPublicKey(res[0])), true);
});

test('generateKeyPairFromPrivkey', (t) => {
  const secp256k1 = new Secp256k1();
  const res = secp256k1.generateKeyPairFromPrivkey(
    new Uint8Array([
      75, 56, 95, 43, 121, 252, 80, 251, 79, 72, 84, 145, 206, 19, 30, 45, 122,
      131, 77, 103, 189, 65, 133, 211, 76, 106, 236, 191, 14, 15, 43, 118,
    ]),
  );

  const pubkey = new Uint8Array([
    2, 103, 109, 164, 12, 37, 181, 117, 255, 140, 228, 252, 90, 140, 72, 38,
    255, 193, 136, 136, 245, 140, 120, 144, 220, 137, 70, 30, 50, 245, 247, 173,
    117,
  ]);

  t.is(areUint8ArraysEqual(res[1], pubkey), true);
});

test('generateSharedSecret', (t) => {
  const privatekey1 = new Uint8Array([
    75, 56, 95, 43, 121, 252, 80, 251, 79, 72, 84, 145, 206, 19, 30, 45, 122,
    131, 77, 103, 189, 65, 133, 211, 76, 106, 236, 191, 14, 15, 43, 118,
  ]);
  const pubkey1 = new Uint8Array([
    2, 103, 109, 164, 12, 37, 181, 117, 255, 140, 228, 252, 90, 140, 72, 38,
    255, 193, 136, 136, 245, 140, 120, 144, 220, 137, 70, 30, 50, 245, 247, 173,
    117,
  ]);

  const privatekey2 = new Uint8Array([
    41, 175, 52, 244, 91, 8, 138, 178, 70, 42, 174, 106, 216, 40, 63, 139, 189,
    160, 132, 10, 5, 77, 193, 66, 100, 31, 90, 115, 94, 183, 174, 121,
  ]);
  const pubkey2 = new Uint8Array([
    3, 88, 115, 50, 146, 84, 60, 250, 251, 178, 226, 11, 96, 27, 246, 197, 87,
    101, 240, 206, 195, 27, 222, 236, 66, 168, 177, 122, 214, 146, 189, 166, 80,
  ]);
  const secp256k1 = new Secp256k1();

  const secret1 = secp256k1.generateSharedSecret(pubkey2, privatekey1);
  const secret2 = secp256k1.generateSharedSecret(pubkey1, privatekey2);

  t.is(areUint8ArraysEqual(secret1, secret2), true);
});

test('sign-verify', (t) => {
  const message = new Uint8Array(32).fill(1);
  const privatekey = new Uint8Array([
    75, 56, 95, 43, 121, 252, 80, 251, 79, 72, 84, 145, 206, 19, 30, 45, 122,
    131, 77, 103, 189, 65, 133, 211, 76, 106, 236, 191, 14, 15, 43, 118,
  ]);
  const pubkey = new Uint8Array([
    2, 103, 109, 164, 12, 37, 181, 117, 255, 140, 228, 252, 90, 140, 72, 38,
    255, 193, 136, 136, 245, 140, 120, 144, 220, 137, 70, 30, 50, 245, 247, 173,
    117,
  ]);

  const secp256k1 = new Secp256k1();
  const signature = secp256k1.sign(message, privatekey);

  t.is(secp256k1.verify(signature, message, pubkey), true);
});

test('getPubkeyFromSignature', (t) => {
  const message = new Uint8Array(32).fill(1);
  const pubkey = new Uint8Array([
    2, 103, 109, 164, 12, 37, 181, 117, 255, 140, 228, 252, 90, 140, 72, 38,
    255, 193, 136, 136, 245, 140, 120, 144, 220, 137, 70, 30, 50, 245, 247, 173,
    117,
  ]);

  const secp256k1 = new Secp256k1();
  const signature = new Uint8Array([
    157, 248, 43, 12, 204, 10, 35, 145, 121, 2, 123, 177, 95, 138, 177, 214, 95,
    25, 145, 134, 139, 217, 154, 171, 126, 37, 23, 158, 217, 232, 93, 215, 1,
    171, 86, 245, 56, 56, 230, 135, 217, 210, 207, 146, 85, 202, 198, 118, 128,
    227, 194, 165, 61, 34, 180, 40, 104, 172, 48, 210, 67, 5, 117, 191, 1,
  ]);

  const parsedPubkey = secp256k1.getPubkeyFromSignature(signature, message);

  t.is(areUint8ArraysEqual(pubkey, parsedPubkey), true);
});

test('getHDKeyFromMnemonic', (t) => {
  const secp256k1 = new Secp256k1();
  // secret passphrase: 223
  const mnemonic =
    'finger plug meadow swamp filter object second vintage embrace correct knee bullet deposit film fish involve route sustain embark broccoli cable reveal oyster panda';
  const HDKey = secp256k1.getHDKey(mnemonic);

  const hdkey = HDKey.derive(`m/44'/60'/0'/0/5`);
  const pk = new Uint8Array([
    214, 136, 180, 158, 205, 169, 212, 66, 73, 187, 117, 123, 176, 0, 210, 16,
    91, 23, 220, 156, 118, 70, 25, 152, 84, 129, 234, 182, 247, 16, 15, 183,
  ]);

  t.is(areUint8ArraysEqual(hdkey.privateKey, pk), true);
});

test('deriveFromSeed', (t) => {
  const secp256k1 = new Secp256k1();
  const mnemonic =
    'finger plug meadow swamp filter object second vintage embrace correct knee bullet deposit film fish involve route sustain embark broccoli cable reveal oyster panda';
  const pair = secp256k1.deriveFromSeed(mnemonic, `m/44'/60'/0'/0/5`);
  const pk = new Uint8Array([
    214, 136, 180, 158, 205, 169, 212, 66, 73, 187, 117, 123, 176, 0, 210, 16,
    91, 23, 220, 156, 118, 70, 25, 152, 84, 129, 234, 182, 247, 16, 15, 183,
  ]);

  const res = secp256k1.generateKeyPairFromPrivkey(pk);
  t.is(
    areUint8ArraysEqual(pair[0], pk) && areUint8ArraysEqual(pair[1], res[1]),
    true,
  );
});

test('deriveFromHDkey', (t) => {
  const secp256k1 = new Secp256k1();
  const mnemonic =
    'finger plug meadow swamp filter object second vintage embrace correct knee bullet deposit film fish involve route sustain embark broccoli cable reveal oyster panda';
  const HDKey = secp256k1.getHDKey(mnemonic);

  const pair = secp256k1.deriveFromHDkey(HDKey, `m/44'/60'/0'/0/5`);
  const pk = new Uint8Array([
    214, 136, 180, 158, 205, 169, 212, 66, 73, 187, 117, 123, 176, 0, 210, 16,
    91, 23, 220, 156, 118, 70, 25, 152, 84, 129, 234, 182, 247, 16, 15, 183,
  ]);

  const res = secp256k1.generateKeyPairFromPrivkey(pk);
  t.is(
    areUint8ArraysEqual(pair[0], pk) && areUint8ArraysEqual(pair[1], res[1]),
    true,
  );
});

test('getXpub', (t) => {
  const secp256k1 = new Secp256k1();
  const mnemonic =
    'finger plug meadow swamp filter object second vintage embrace correct knee bullet deposit film fish involve route sustain embark broccoli cable reveal oyster panda';
  const xpub1 = secp256k1.getXpub(mnemonic, `m/44'/60'/0'`);
  const xpub2 =
    'xpub6CNAT4esfWBaxJpYcxaVhpVebSeuTcYLqji5qAezsp32X6kZk7Eyk9dwW8tUaaxCkKQwbY1vGtiiAoQYybiPUsCxxxaes5xATeVjTPhrkH1';
  t.is(xpub1, xpub2);
});

test('deriveFromXpub', (t) => {
  const secp256k1 = new Secp256k1();
  const xpub =
    'xpub6CNAT4esfWBaxJpYcxaVhpVebSeuTcYLqji5qAezsp32X6kZk7Eyk9dwW8tUaaxCkKQwbY1vGtiiAoQYybiPUsCxxxaes5xATeVjTPhrkH1';
  const pubkey1 = secp256k1.deriveFromXpub(xpub, `m/0/5`);

  const pubkey2 = new Uint8Array([
    2, 132, 70, 215, 81, 0, 182, 70, 225, 201, 109, 114, 64, 13, 78, 237, 150,
    17, 118, 207, 169, 57, 69, 29, 232, 32, 74, 37, 98, 85, 57, 35, 36,
  ]);

  t.is(areUint8ArraysEqual(pubkey1, pubkey2), true);
});

test('deriveFromHDKeyForPubkey', (t) => {
  const secp256k1 = new Secp256k1();
  const HDKey = secp256k1.getHDKey(
    'xpub6CNAT4esfWBaxJpYcxaVhpVebSeuTcYLqji5qAezsp32X6kZk7Eyk9dwW8tUaaxCkKQwbY1vGtiiAoQYybiPUsCxxxaes5xATeVjTPhrkH1',
  );
  const pubkey1 = secp256k1.deriveFromHDKeyForPubkey(HDKey, `m/0/5`);
  const pubkey2 = new Uint8Array([
    2, 132, 70, 215, 81, 0, 182, 70, 225, 201, 109, 114, 64, 13, 78, 237, 150,
    17, 118, 207, 169, 57, 69, 29, 232, 32, 74, 37, 98, 85, 57, 35, 36,
  ]);
  t.is(areUint8ArraysEqual(pubkey1, pubkey2), true);
});
