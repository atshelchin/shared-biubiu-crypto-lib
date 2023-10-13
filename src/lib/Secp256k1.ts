import { secp256k1 } from '@noble/curves/secp256k1';
import { HDKey } from '@scure/bip32';
import type { HDKey as HDKeyType } from '@scure/bip32';
import * as bip39 from '@scure/bip39';

import Cryptolib from './Cryptolib.js';
import type { KeyPair, PrivKey, PubKey } from './Interface.js';

export default class Secp256k1 extends Cryptolib {
  generateKeyPair(): KeyPair {
    const privKey = secp256k1.utils.randomPrivateKey();
    const pubKey = secp256k1.getPublicKey(privKey);
    return [privKey, pubKey];
  }

  generateKeyPairFromPrivkey(privateKey: PrivKey): KeyPair {
    const pubKey = secp256k1.getPublicKey(privateKey);
    return [privateKey, pubKey];
  }

  generateSharedSecret(publicKey: PubKey, privateKey: PrivKey): Uint8Array {
    return secp256k1.getSharedSecret(privateKey, publicKey);
  }

  sign(message: Uint8Array, privateKey: PrivKey): Uint8Array {
    const sig = secp256k1.sign(message, privateKey);
    return Uint8Array.from([...sig.toCompactRawBytes(), sig.recovery]);
  }

  verify(signature: Uint8Array, message: Uint8Array, pubkey: PubKey): boolean {
    return secp256k1.verify(signature.slice(0, 64), message, pubkey);
  }

  // ed25519  can't do it
  getPubkeyFromSignature(signature: Uint8Array, message: Uint8Array): PubKey {
    return secp256k1.Signature.fromCompact(signature.slice(0, 64))
      .addRecoveryBit(signature[64])
      .recoverPublicKey(message)
      .toRawBytes();
  }

  // HDKEY
  getHDKey(mnemonicOrXpub: string): HDKeyType {
    if (!mnemonicOrXpub.includes(' ')) {
      return HDKey.fromExtendedKey(mnemonicOrXpub);
    } else {
      const seed = bip39.mnemonicToSeedSync(mnemonicOrXpub);
      return HDKey.fromMasterSeed(seed);
    }
  }

  deriveFromSeed(mnemonic: string, path: string): KeyPair {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const hdkey = HDKey.fromMasterSeed(seed);
    const deriveNode = hdkey.derive(path);
    return [deriveNode.privateKey, deriveNode.publicKey];
  }

  deriveFromHDkey(hdkey: HDKeyType, path: string): KeyPair {
    const deriveNode = hdkey.derive(path);
    return [deriveNode.privateKey, deriveNode.publicKey];
  }

  // ed25519  can't do it so far
  getXpub(mnemonic: string, path: string) {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const hdkey = HDKey.fromMasterSeed(seed);
    const masterNode = hdkey.derive(path);
    return masterNode.publicExtendedKey;
  }

  // ed25519  can't do it so far
  deriveFromXpub(xpub: string, path: string): PubKey {
    const hdkey = HDKey.fromExtendedKey(xpub);
    const deriveNode = hdkey.derive(path);
    return deriveNode.publicKey;
  }

  // ed25519  can't do it so far
  deriveFromHDKeyForPubkey(hdkey: HDKeyType, path: string): PubKey {
    const deriveNode = hdkey.derive(path);
    return deriveNode.publicKey;
  }
}
