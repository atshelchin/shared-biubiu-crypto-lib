import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { md5, sha256 } from 'hash-wasm';
import { hexToBytes } from 'viem';

import type { Ed25519KeyPair, KeyPair, PrivKey, PubKey } from './Interface';
export default abstract class Cryptolib {
  abstract generateKeyPair(): KeyPair | Ed25519KeyPair;
  abstract generateSharedSecret(
    publicKey: PubKey,
    privateKey: PrivKey,
  ): Uint8Array;
  abstract sign(message: Uint8Array, privateKey: PrivKey): Uint8Array;
  abstract verify(
    signature: Uint8Array,
    message: Uint8Array,
    pubkey: PubKey,
  ): boolean;

  // mnemonic
  generateMnemonic(length: number) {
    if (length == 24) {
      return bip39.generateMnemonic(wordlist, 256);
    } else {
      return bip39.generateMnemonic(wordlist, 128);
    }
  }

  mnemonicToSeedSync(mnemonic: string): Uint8Array {
    return bip39.mnemonicToSeedSync(mnemonic);
  }

  validateMnemonic(mnemonic: string): boolean {
    return bip39.validateMnemonic(mnemonic, wordlist);
  }

  async getMnemonic(passphrase: string, length: number): Promise<string> {
    const passphraseTrim = passphrase.trim();
    if (length == 24) {
      const sha256Checksum = await sha256(passphraseTrim);
      return bip39.entropyToMnemonic(
        hexToBytes(`0x${sha256Checksum}`),
        wordlist,
      );
    } else {
      const md5Checksum = await md5(passphraseTrim);
      return bip39.entropyToMnemonic(hexToBytes(`0x${md5Checksum}`), wordlist);
    }
  }
}
