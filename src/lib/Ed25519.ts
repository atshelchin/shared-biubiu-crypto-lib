import { ed25519, x25519 } from '@noble/curves/ed25519';
import * as bip39 from '@scure/bip39';
import { HDKey } from 'ed25519-keygen/hdkey';
import type { HDKey as HDKeyType } from 'ed25519-keygen/hdkey';

import Cryptolib from './Cryptolib.js';
import type { Ed25519KeyPair, PrivKey, PubKey } from './Interface.js';

export default class Ed25519 extends Cryptolib {
  generateKeyPair(): Ed25519KeyPair {
    const privKey = ed25519.utils.randomPrivateKey();
    const pubKey = ed25519.getPublicKey(privKey);
    const x25519pubkey = x25519.getPublicKey(privKey);

    return [privKey, pubKey, x25519pubkey];
  }

  generateKeyPairFromPrivkey(privateKey: PrivKey): Ed25519KeyPair {
    const pubKey = ed25519.getPublicKey(privateKey);
    const x25519pubkey = x25519.getPublicKey(privateKey);
    return [privateKey, pubKey, x25519pubkey];
  }

  generateSharedSecret(publicKey: PubKey, privateKey: PrivKey): Uint8Array {
    return x25519.getSharedSecret(privateKey, publicKey);
  }

  sign(message: Uint8Array, privateKey: PrivKey): Uint8Array {
    return ed25519.sign(message, privateKey);
  }

  verify(signature: Uint8Array, message: Uint8Array, pubkey: PubKey): boolean {
    return ed25519.verify(signature, message, pubkey);
  }

  // HDKEY
  getHDKey(mnemonicOrXpub: string): HDKeyType {
    const seed = bip39.mnemonicToSeedSync(mnemonicOrXpub);
    return HDKey.fromMasterSeed(seed);
  }

  deriveFromSeed(mnemonic: string, path: string): Ed25519KeyPair {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const hdkey = HDKey.fromMasterSeed(seed);
    const deriveNode = hdkey.derive(path);
    const pubKey = ed25519.getPublicKey(deriveNode.privateKey);
    const x25519pubkey = x25519.getPublicKey(deriveNode.privateKey);
    return [deriveNode.privateKey, pubKey, x25519pubkey];
  }

  deriveFromHDkey(hdkey: HDKeyType, path: string): Ed25519KeyPair {
    const deriveNode = hdkey.derive(path);
    const x25519pubkey = x25519.getPublicKey(deriveNode.privateKey);
    const pubKey = ed25519.getPublicKey(deriveNode.privateKey);
    return [deriveNode.privateKey, pubKey, x25519pubkey];
  }
}
