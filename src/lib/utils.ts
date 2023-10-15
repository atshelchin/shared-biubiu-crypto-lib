import { BitcoinAddress } from 'bech32-buffer';
import bs58 from 'bs58';
import { keccak, ripemd160, sha256 } from 'hash-wasm';
import { bytesToHex, hexToBytes } from 'viem';
import type { Hex } from 'viem';

import type {
  BTCAddressType,
  ETHAddress,
  PubKey,
  TronAddress,
} from './Interface';

// to address
export const toETHAddress = async (
  uncompressedPubKey: PubKey,
): Promise<ETHAddress> => {
  if (uncompressedPubKey.length == 65) {
    const hash = await keccak(uncompressedPubKey.slice(1, 65), 256);
    return `0x${hash.slice(-40)}`;
  }

  if (uncompressedPubKey.length == 64) {
    const hash = await keccak(uncompressedPubKey, 256);
    return `0x${hash.slice(-40)}`;
  }

  throw new Error('Invalid uncompressedPubKey');
};
export const toTronAddress = async (
  uncompressedPubKey: PubKey,
): Promise<TronAddress> => {
  const hexAddr = await toETHAddress(uncompressedPubKey);
  return await hexToTronBs58(hexAddr);
};

export const hexToTronBs58 = async (
  hexAddr: ETHAddress,
): Promise<TronAddress> => {
  const bytes = hexToBytes(hexAddr.replace('0x', '0x41') as Hex);

  const hash0 = await sha256(bytes);
  const hash1 = await sha256(hexToBytes(`0x${hash0}`));

  const checkSum = hexToBytes(`0x${hash1}`).slice(0, 4);

  return bs58.encode(new Uint8Array([...bytes, ...checkSum]));
};

export const tronBs58ToHex = (bs58Addr: TronAddress): ETHAddress => {
  const bytes = bs58.decode(bs58Addr);
  return `0x${bytesToHex(bytes).replace('0x41', '')}`.slice(
    0,
    42,
  ) as ETHAddress;
};

export const toBTCAddress = async (
  pubkey: PubKey,
  addressType: BTCAddressType,
) => {
  if (pubkey.length == 33) {
    if (addressType == 'P2PKH') {
      return await P2PKH(pubkey);
    }

    if (addressType == 'P2WPKH') {
      return await P2WPKH(pubkey);
    }
    if (addressType == 'P2SH-P2WPKH') {
      const address = await P2WPKH(pubkey);
      return await P2SH_P2WPKH(address);
    }

    throw new Error('Invalid addressType');
  }

  throw new Error('Invalid pubkey');
};

export const hash160 = async (data: Uint8Array): Promise<Uint8Array> => {
  const hash0 = await sha256(data);
  const hash1 = await ripemd160(hexToBytes(`0x${hash0}`));
  return hexToBytes(`0x${hash1}`);
};

export const P2PKH = async (pubkey: PubKey) => {
  const hash0 = await sha256(pubkey);
  const hash1 = await ripemd160(hexToBytes(`0x${hash0}`));
  const bytes0 = hexToBytes(`0x00${hash1}`);
  const hash2 = await sha256(bytes0);
  const hash3 = await sha256(hexToBytes(`0x${hash2}`));
  const checkSum = hexToBytes(`0x${hash3}`).slice(0, 4);

  return bs58.encode(new Uint8Array([...bytes0, ...checkSum]));
};

export const P2WPKH = async (pubkey: PubKey) => {
  const hash0 = await hash160(pubkey);
  const prefix = 'bc';
  const scriptVersion = 0;

  return new BitcoinAddress(prefix, scriptVersion, hash0).encode();
};

export const P2SH_P2WPKH = async (P2WPKHAddr: string) => {
  const decoded = BitcoinAddress.decode(P2WPKHAddr);
  const version = 0;
  const len = 20;
  const redeemScript = new Uint8Array([version, len, ...decoded.data]);
  return await P2SH(redeemScript);
};

export const P2SH = async (pubkey: PubKey) => {
  const hash0 = await hash160(pubkey);
  const versionPrefix = 5;
  const hash1 = await sha256(new Uint8Array([versionPrefix, ...hash0]));
  const hash2 = await sha256(hexToBytes(`0x${hash1}`));
  const checkSum = hexToBytes(`0x${hash2}`).slice(0, 4);
  console.log(
    'P2SH addr',
    bs58.encode(new Uint8Array([versionPrefix, ...hash0, ...checkSum])),
  );
  return bs58.encode(new Uint8Array([versionPrefix, ...hash0, ...checkSum]));
};

export const toAptosAddress = () => {};
export const toSolanaAddress = () => {};
export const toSUIAddress = () => {};

// sign in eth
export const signMessageInETH = () => {};
export const signTypedDataInETH = () => {};
export const signTxnInETH = () => {};

// sign in tron
export const signMessageInTron = () => {};
export const signTypedDataInTron = () => {};

export const signTxnInTron = () => {};

// sign in btc
export const signTxnInBTC = () => {};

// sign in Aptos
export const signTxnInAptos = () => {};

// sign in Solana
export const signTxnInSolana = () => {};

// sign in SUI
export const signTxnInSUI = () => {};

// AES encrypt
export const decrypt = () => {};
export const encrypt = () => {};

export const areUint8ArraysEqual = (arr1: Uint8Array, arr2: Uint8Array) => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((value, index) => value === arr2[index]);
};
