import { Keypair } from "@solana/web3.js";

export async function getSecureKeypair(): Promise<Keypair> {
  const privateKeyUint8Array = new Uint8Array([
    101, 202, 74, 60, 67, 214, 163, 189, 25, 27, 177, 236, 193, 116, 162, 232,
    222, 24, 156, 248, 109, 73, 181, 18, 130, 202, 121, 130, 178, 233, 125, 112,
    36, 94, 96, 112, 111, 152, 147, 129, 157, 105, 190, 203, 62, 106, 39, 33,
    216, 175, 162, 132, 145, 135, 96, 111, 185, 66, 127, 108, 19, 38, 202, 1,
  ]);

  return Keypair.fromSecretKey(privateKeyUint8Array);
}
