import bs58 from 'bs58';
import { keccak, sha256 } from 'hash-wasm';
import { bytesToHex, hexToBytes } from 'viem';
import type { Hex } from 'viem';

import type { ETHAddress, PubKey, TronAddress } from './Interface';

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

export const toBTCAddress = () => {};
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
