import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import React, { useCallback, useState } from "react";

type SendButtonProps = {
  onSuccess: Function;
};

const appOwnerKey = Keypair.fromSecretKey(
  bs58.decode(
    "5vZVbqNyqZ8mSqaK4Svmj1W4sGthkwJdKeTAVKAbxTto8MmzBnnuxL7wiJs3xqt18NpoHftPhGKC6ZbkLZLqMwVK"
  )
);

const SendButton = ({ onSuccess }: SendButtonProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const handleClickEvent = useCallback(() => {
    if (!connection || !publicKey) {
      return;
    }

    setIsLoading(true);

    // Add transfer instruction to transaction
    // Send SOL to the App owner's wallet
    const transactionOne = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: appOwnerKey.publicKey,
        lamports: LAMPORTS_PER_SOL / 10,
      })
    );

    // Add transfer instruction to transaction
    // Send SOL from the App owner's wallet to the user's wallet
    const transactionTwo = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: appOwnerKey.publicKey,
        toPubkey: publicKey,
        lamports: (LAMPORTS_PER_SOL * 2) / 10,
      })
    );

    // Sign transaction, broadcast, and confirm
    sendTransaction(transactionOne, connection)
      .then((signature) => {
        return connection.confirmTransaction(signature);
      })
      .then((rpcResponseAndContext) => {
        if (rpcResponseAndContext.value.err) {
          console.log({ error: rpcResponseAndContext.value.err });
          return null;
        }
        return sendAndConfirmTransaction(connection, transactionTwo, [appOwnerKey]);
      })
      .then((res) => {
        if (!res) return;
        typeof onSuccess === "function" && onSuccess();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [connection, publicKey]);

  return (
    <button
      className="bg-sky-400 hover:bg-amber-400 disabled:bg-slate-400 disabled:cursor-not-allowed px-4 py-2 text-white font-semibold"
      onClick={handleClickEvent}
      disabled={isLoading}
    >
      Send
    </button>
  );
};

export default React.memo(SendButton);
