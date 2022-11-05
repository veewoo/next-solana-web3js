// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import * as fs from "fs";
import web3, {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  getAccount,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import base58 from "bs58";

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  "8332QygrdJsq5WUFjFuCtQr7Aaks77yGjUD81CoE2KNT"
);

const TOKEN_MINT = new PublicKey(
  // "8332QygrdJsq5WUFjFuCtQr7Aaks77yGjUD81CoE2KNT"
  "AhtVG8jn4o4wh54CdPky2irnAxzFySWXxbgJZ7ZSDQJ6"
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const connection = new Connection(clusterApiUrl("devnet"));

    const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[];
    const secretKey = Uint8Array.from(secret);

    return res.status(200).json({ secretKey });

    const keyPair = await initializeKeypair(connection);

    // const keyPair = Keypair.fromSecretKey(
    //   base58.decode(
    //     "3WorQLE9wJsdC9MUtAyNCZYaCTKUD5fzcsR3pJJisWk1xw21tn8SXkR9xh1QWSGEaMaw6WqyT9un3zASPH2UKRnU"
    //   )
    // );

    const mint = await createNewMint(
      connection,
      keyPair,
      keyPair.publicKey,
      keyPair.publicKey,
      0
    );

    const tokenAccount = await createTokenAccount(
      connection,
      keyPair,
      mint,
      // TOKEN_MINT,
      keyPair.publicKey
    );

    await mintTokens(
      connection,
      keyPair,
      mint,
      // TOKEN_MINT,
      tokenAccount.address,
      keyPair,
      100
    );

    res.status(200).json("success");
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ ...error });
  }
}

export async function initializeKeypair(
  connection: Connection
): Promise<Keypair> {
  if (!process.env.PRIVATE_KEY) {
    console.log("Creating .env file");
    const signer = Keypair.generate();
    fs.writeFileSync(".env", `PRIVATE_KEY=[${signer.secretKey.toString()}]`);
    await airdropSolIfNeeded(signer, connection);

    return signer;
  }

  const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[];
  const secretKey = Uint8Array.from(secret);
  const keyPairFromSecretKey = Keypair.fromSecretKey(secretKey);
  await airdropSolIfNeeded(keyPairFromSecretKey, connection);

  return keyPairFromSecretKey;
}

async function airdropSolIfNeeded(signer: Keypair, connection: Connection) {
  const balance = await connection.getBalance(signer.publicKey);
  console.log("Current balance is", balance);
  if (balance < LAMPORTS_PER_SOL) {
    console.log("Airdropping 1 SOL...");
    await connection.requestAirdrop(signer.publicKey, LAMPORTS_PER_SOL);
  }
}

async function createNewMint(
  connection: Connection,
  payer: Keypair,
  mintAuthority: PublicKey,
  freezeAuthority: PublicKey,
  decimals: number
): Promise<PublicKey> {
  const tokenMint = await createMint(
    connection,
    payer,
    mintAuthority,
    freezeAuthority,
    decimals
  );

  console.log(
    `Token Mint: https://explorer.solana.com/address/${tokenMint}?cluster=devnet`
  );

  return tokenMint;
}

async function createTokenAccount(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  owner: PublicKey
) {
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    owner
  );

  console.log(
    `Token Account: https://explorer.solana.com/address/${tokenAccount.address}?cluster=devnet`
  );

  return tokenAccount;
}

async function mintTokens(
  connection: Connection,
  payer: Keypair,
  mint: PublicKey,
  destination: PublicKey,
  authority: Keypair,
  amount: number
) {
  const transactionSignature = await mintTo(
    connection,
    payer,
    mint,
    destination,
    authority,
    amount
  );

  console.log(
    `Mint Token Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
  );
}

async function findAssociatedTokenAddress(
  walletAddress: PublicKey,
  tokenMintAddress: PublicKey
): Promise<PublicKey> {
  return (
    await PublicKey.findProgramAddress(
      [
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0];
}
