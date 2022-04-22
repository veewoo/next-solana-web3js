import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import React, { useCallback, useState } from "react";

type AirdropButtonProps = {
  onSuccess: Function;
};

const AirdropButton = ({ onSuccess }: AirdropButtonProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const handleClickEvent = useCallback(() => {
    if (!connection || !publicKey) {
      return;
    }

    setIsLoading(true);

    connection
      .requestAirdrop(publicKey, LAMPORTS_PER_SOL)
      .then((airdropSignature) =>
        connection.confirmTransaction(airdropSignature)
      )
      .then((rpcResponseAndContext) => {
        if (!rpcResponseAndContext.value.err) {
          typeof onSuccess === "function" && onSuccess();
        }
      })
      .finally(() => {
        setTimeout(() => setIsLoading(false), 10000);
      });
  }, [connection, publicKey, onSuccess]);

  return (
    <button
      className="bg-cyan-400 hover:bg-amber-400 disabled:bg-slate-400 disabled:cursor-not-allowed px-4 py-2 text-white font-semibold mr-2 rounded"
      onClick={handleClickEvent}
      disabled={isLoading}
    >
      Airdrop 1 SOL
    </button>
  );
};

export default React.memo(AirdropButton);
