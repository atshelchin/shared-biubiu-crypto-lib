import test from 'ava';

import {
  hexToTronBs58,
  toAptosAddress,
  toAptosWIF,
  toBTCAddress,
  toBTCWIF,
  toETHAddress,
  toETHWIF,
  toSolanaAddress,
  toSolanaWIF,
  toSUIAddress,
  toTronAddress,
  toTronWIF,
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

test('toBTCAddress-P2SH_P2WPKH-another-pubkey', async (t) => {
  const pubkey = new Uint8Array([
    2, 63, 179, 216, 245, 117, 19, 113, 233, 207, 58, 30, 146, 190, 20, 61, 221,
    75, 11, 183, 31, 20, 177, 37, 21, 144, 42, 4, 226, 153, 185, 82, 145,
  ]);

  t.is(
    await toBTCAddress(pubkey, 'P2SH-P2WPKH'),
    '3CMGKR3hepw4CsrxEunQh351jYvwhRCUkX',
  );
});

test('toBTCWIF', async (t) => {
  const privkey = new Uint8Array([
    2, 0, 120, 14, 111, 191, 217, 240, 218, 105, 87, 100, 166, 39, 247, 251, 26,
    195, 249, 125, 17, 132, 70, 130, 187, 205, 15, 184, 241, 250, 110, 74,
  ]);

  t.is(
    await toBTCWIF(privkey),
    'KwHbszP8MiLRCuq7D1yT7sDKxFnS4X2nzUDEWayBh3KzTSBgAChH',
  );
});
test('toETHWIF', async (t) => {
  const privkey = new Uint8Array([
    4, 147, 16, 65, 254, 46, 35, 232, 253, 155, 121, 241, 109, 48, 46, 161, 229,
    180, 195, 94, 254, 227, 226, 2, 12, 187, 16, 252, 183, 200, 187, 115,
  ]);

  t.is(
    await toETHWIF(privkey),
    '0x04931041fe2e23e8fd9b79f16d302ea1e5b4c35efee3e2020cbb10fcb7c8bb73',
  );
});

test('toTronWIF', async (t) => {
  const privkey = new Uint8Array([
    4, 147, 16, 65, 254, 46, 35, 232, 253, 155, 121, 241, 109, 48, 46, 161, 229,
    180, 195, 94, 254, 227, 226, 2, 12, 187, 16, 252, 183, 200, 187, 115,
  ]);

  t.is(
    await toTronWIF(privkey),
    '04931041fe2e23e8fd9b79f16d302ea1e5b4c35efee3e2020cbb10fcb7c8bb73',
  );
});

test('toAptosWIF', async (t) => {
  const privkey = new Uint8Array([
    138, 59, 150, 235, 43, 19, 81, 92, 192, 5, 214, 170, 33, 1, 79, 249, 115,
    136, 237, 160, 124, 52, 223, 140, 71, 254, 44, 46, 56, 149, 20, 220,
  ]);

  t.is(
    await toAptosWIF(privkey),
    '0x8a3b96eb2b13515cc005d6aa21014ff97388eda07c34df8c47fe2c2e389514dc',
  );
});

test('toAptosAddress', async (t) => {
  const pubkey = new Uint8Array([
    52, 200, 88, 71, 104, 163, 158, 226, 198, 228, 179, 205, 216, 242, 14, 45,
    184, 17, 56, 92, 169, 192, 118, 213, 141, 203, 153, 252, 50, 146, 124, 107,
    0,
  ]);

  t.is(
    await toAptosAddress(pubkey),
    '0xa547c5e4f85513bd6f35199e20cf0f9217816d56781d69a8d72aed79482a7713',
  );
});

test('toSolanaAddress', async (t) => {
  const pubkey = new Uint8Array([
    233, 139, 15, 100, 3, 244, 105, 93, 115, 82, 87, 52, 196, 128, 110, 118, 61,
    66, 9, 218, 50, 51, 124, 239, 16, 167, 211, 55, 227, 164, 232, 228,
  ]);

  t.is(
    await toSolanaAddress(pubkey),
    'GieynY44ruznz3JgRte2PsbA3oV24TLJGtAKMjbMXwRm',
  );
});

test('toSolanaWIF', async (t) => {
  const privkey = new Uint8Array([
    37, 131, 108, 156, 68, 90, 169, 138, 22, 234, 77, 252, 188, 146, 41, 99, 76,
    18, 56, 65, 195, 106, 124, 108, 50, 71, 170, 114, 253, 185, 204, 57,
  ]);

  t.is(
    await toSolanaWIF(privkey),
    'kW3SuswccnXVaxU9muMj9AFHSqg71qfpesyJqNKMNReAHiNwtuWnQPvJ8p6YoS9JiGnVDLWY75DukxBX3T1CgDy',
  );
});

test('toSUIAddress2', (t) => {
  console.log(toSUIAddress());

  t.is(1, 1);
});
