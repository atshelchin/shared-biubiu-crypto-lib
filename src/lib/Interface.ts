export type PubKey = Uint8Array;
export type PrivKey = Uint8Array;
export type KeyPair = [PrivKey, PubKey];
export type Ed25519KeyPair = [PrivKey, PubKey, PubKey];
export type Signature = {
  r: bigint;
  s: bigint;
  recovery: number;
};

export type ETHAddress = `0x${string}`;
export type TronAddress = string;
export type BTCAddressType =
  | 'P2PKH'
  | 'P2WPKH'
  | 'P2SH-P2WPKH'
  | 'P2SH'
  | 'P2WSH'
  | 'P2SH-P2WSH';
