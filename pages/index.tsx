import type { NextPage } from "next";
import AccountInfo from "../components/AccountInfo";
import AirdropButton from "../components/AirdropButton";
import * as web3 from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import SendButton from "../components/SendButton";

const Home: NextPage = () => {
  const [account, setAccount] = useState<web3.AccountInfo<Buffer> | null>(null);
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const getAccountInfo = useCallback(() => {
    if (!connection || !publicKey) {
      setAccount(null);
      return;
    }

    // get account info
    // account data is bytecode that needs to be deserialized
    // serialization and deserialization is program specific
    connection.getAccountInfo(publicKey).then((_account) => {
      setAccount(_account);
    });
  }, [connection, publicKey]);

  useEffect(() => getAccountInfo(), [connection, publicKey, getAccountInfo]);

  return (
    <main className="container mx-auto">
      <section className="mb-12">
        <h1 className="text-3xl md:text-5xl mb-2">
          <b>Veewoo DApp #1</b>
        </h1>
        {!publicKey && (
          <h2 className="text-2xl">
            Please connect your wallet to use this app.
          </h2>
        )}
      </section>
      <section className="mb-2">
        <AccountInfo
          solQuantity={(account?.lamports || 0) / web3.LAMPORTS_PER_SOL}
        />
      </section>
      <section className="">
        <AirdropButton onSuccess={getAccountInfo} />
        <SendButton onSuccess={getAccountInfo} />
      </section>
    </main>
  );
};

export default Home;
