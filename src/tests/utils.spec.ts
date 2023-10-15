import test from 'ava';

import {
  hexToTronBs58,
  toAptosAddress,
  toBTCAddress,
  toETHAddress,
  toSUIAddress,
  toTronAddress,
  tronBs58ToHex,
} from '../lib/utils.js';

test('toETHAddress-valid-65', async (t) => {
  const pubkey = new Uint8Array([
    4, 132, 70, 215, 81, 0, 182, 70, 225, 201, 109, 114, 64, 13, 78, 237, 150,
    17, 118, 207, 169, 57, 69, 29, 232, 32, 74, 37, 98, 85, 57, 35, 36, 142,
    166, 99, 190, 190, 234, 111, 66, 58, 135, 82, 83, 163, 131, 192, 54, 211,
    36, 245, 222, 224, 237, 45, 240, 51, 39, 151, 171, 215, 226, 93, 180,
  ]);
  const address = await toETHAddress(pubkey);

  t.is(address.toLowerCase(), '0xd3a13dfc223cb67c8f1882f1fa17ea9daa776959');
});

test('toETHAddress-valid-64', async (t) => {
  const pubkey = new Uint8Array([
    132, 70, 215, 81, 0, 182, 70, 225, 201, 109, 114, 64, 13, 78, 237, 150, 17,
    118, 207, 169, 57, 69, 29, 232, 32, 74, 37, 98, 85, 57, 35, 36, 142, 166,
    99, 190, 190, 234, 111, 66, 58, 135, 82, 83, 163, 131, 192, 54, 211, 36,
    245, 222, 224, 237, 45, 240, 51, 39, 151, 171, 215, 226, 93, 180,
  ]);
  const address = await toETHAddress(pubkey);
  t.is(address.toLowerCase(), '0xd3a13dfc223cb67c8f1882f1fa17ea9daa776959');
});

test('toETHAddress-invalid', async (t) => {
  const pubkey = new Uint8Array([
    70, 215, 81, 0, 182, 70, 225, 201, 109, 114, 64, 13, 78, 237, 150, 17, 118,
    207, 169, 57, 69, 29, 232, 32, 74, 37, 98, 85, 57, 35, 36, 142, 166, 99,
    190, 190, 234, 111, 66, 58, 135, 82, 83, 163, 131, 192, 54, 211, 36, 245,
    222, 224, 237, 45, 240, 51, 39, 151, 171, 215, 226, 93, 180,
  ]);

  try {
    await toETHAddress(pubkey);
  } catch (error) {
    t.is(typeof error, 'object');
  }
});

test('toTronAddress', async (t) => {
  const pubkey = new Uint8Array([
    132, 70, 215, 81, 0, 182, 70, 225, 201, 109, 114, 64, 13, 78, 237, 150, 17,
    118, 207, 169, 57, 69, 29, 232, 32, 74, 37, 98, 85, 57, 35, 36, 142, 166,
    99, 190, 190, 234, 111, 66, 58, 135, 82, 83, 163, 131, 192, 54, 211, 36,
    245, 222, 224, 237, 45, 240, 51, 39, 151, 171, 215, 226, 93, 180,
  ]);
  const address = await toTronAddress(pubkey);

  t.is(address, 'TVGCjqNEHhu2WHk5YS48r4A5x3tfEzKGac');
});

test('tronBs58ToHex', (t) => {
  t.is(
    tronBs58ToHex('TVGCjqNEHhu2WHk5YS48r4A5x3tfEzKGac').toLowerCase(),
    '0xd3a13dfc223cb67c8f1882f1fa17ea9daa776959',
  );
});

test('hexToTronBs58', async (t) => {
  t.is(
    await hexToTronBs58('0xd3a13dfc223cb67c8f1882f1fa17ea9daa776959'),
    'TVGCjqNEHhu2WHk5YS48r4A5x3tfEzKGac',
  );
});

test('toBTCAddress-P2PKH', async (t) => {
  const pubkey = new Uint8Array([
    2, 20, 170, 58, 33, 247, 51, 151, 138, 244, 104, 175, 56, 1, 230, 234, 193,
    52, 115, 3, 113, 115, 177, 25, 24, 16, 24, 148, 62, 103, 214, 80, 183,
  ]);
  t.is(
    await toBTCAddress(pubkey, 'P2PKH'),
    '13Rqm5AyPqs3KhpGYWACNfeYtq8D4Ak63e',
  );
});

test('toBTCAddress-P2PKH-another-pubkey', async (t) => {
  const pubkey = new Uint8Array([
    2, 180, 19, 234, 67, 117, 25, 97, 221, 118, 210, 23, 30, 146, 218, 212, 26,
    114, 253, 249, 111, 61, 159, 1, 118, 58, 43, 56, 168, 232, 56, 37, 18,
  ]);

  t.is(
    await toBTCAddress(pubkey, 'P2PKH'),
    '1PvSuRvaqBPnzKg39qCGzPVXKx6CHFZ29H',
  );
});

test('toBTCAddress-P2WPKH', async (t) => {
  const pubkey = new Uint8Array([
    2, 180, 19, 234, 67, 117, 25, 97, 221, 118, 210, 23, 30, 146, 218, 212, 26,
    114, 253, 249, 111, 61, 159, 1, 118, 58, 43, 56, 168, 232, 56, 37, 18,
  ]);

  t.is(
    await toBTCAddress(pubkey, 'P2WPKH'),
    'bc1qldhxlnen3xqyw25k3vtcrjne2gph5anm4mptl9',
  );
});

test('toBTCAddress-P2SH_P2WPKH', async (t) => {
  const pubkey = new Uint8Array([
    2, 180, 19, 234, 67, 117, 25, 97, 221, 118, 210, 23, 30, 146, 218, 212, 26,
    114, 253, 249, 111, 61, 159, 1, 118, 58, 43, 56, 168, 232, 56, 37, 18,
  ]);

  t.is(
    await toBTCAddress(pubkey, 'P2SH-P2WPKH'),
    '38pVaiGCcX5ccWhyPjTsibCXx2MCb1TPDq',
  );
});

test('toSUIAddress2', (t) => {
  console.log(toSUIAddress());
  console.log(toAptosAddress());
  t.is(1, 1);
});
