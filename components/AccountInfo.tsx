import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import React from "react";

type AccountInfoProps = {
  solQuantity: number;
};

const AccountInfo = ({ solQuantity }: AccountInfoProps) => {
  const { publicKey } = useWallet();

  return (
    <div>
      <h1 className="text-6xl mb-4 text-center">
        {!publicKey && "Hello! please connect your wallet to use this app."}
        {publicKey && (
          <>
            <span>Hi, </span>
            <span className="text-green-400">
              {truncateText(publicKey.toBase58())}
            </span>
          </>
        )}
      </h1>
      <div className="flex flex-wrap items-center justify-center mb-4 button-group">
        <WalletMultiButton />
        <WalletDisconnectButton />
      </div>
      {publicKey && (
        <h2 className="text-xl">
          <span>
            <b>Ballance:</b> {solQuantity} SOL
          </span>
        </h2>
      )}
      <h2 className="text-xl">
        <span>
          <b>Network:</b> Devnet
        </span>
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
  return (
    text.substring(0, 4) + "..." + text.substring(text.length - 4, text.length)
  );
}

export default React.memo(AccountInfo);
