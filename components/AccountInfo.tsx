import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect } from "react";

type AccountInfoProps = {
  solQuantity: number;
};

const AccountInfo = ({ solQuantity }: AccountInfoProps) => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    // connection.getClusterNodes().then((res) => console.log(res));
    console.log(connection.rpcEndpoint);
    
  }, [connection]);

  return (
    <div>
      {publicKey && (
        <>
          <h2 className="text-2xl">
            <b>Address:</b> {truncateText(publicKey.toBase58())}
          </h2>
          <h2 className="text-2xl">
            <b>Ballance:</b> {solQuantity} SOL
          </h2>
        </>
      )}
      <h2 className="text-2xl">
        <b>Network:</b> Devnet
      </h2>
      <p>
        Send me 0.1 SOL and my app will send you back 0.2 SOL automatically.{" "}
        <br />
        If you don&apos;t have any SOL in your wallet, you can click to
        &quot;Airdrop 1 SOL&quot; button to receive 1 SOL (Waiting interval: 10
        seconds).
      </p>
    </div>
  );
};

function truncateText(text: string) {
  if (!text) return "";
  if (window.screen.width > 768) return text;
  return (
    text.substring(0, 4) + "..." + text.substring(text.length - 4, text.length)
  );
}

export default React.memo(AccountInfo);
