// to address
export const toETHAddress = () => {
  console.log('tron');
};
export const toTronAddress = () => {
  console.log('tron');
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
