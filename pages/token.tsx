import type { NextPage } from "next";
import AccountInfo from "../components/AccountInfo";
import AirdropButton from "../components/AirdropButton";
import { useCallback, useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import SendButton from "../components/SendButton";
import { createMint } from "@solana/spl-token";
import axios from "axios";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

const Token: NextPage = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const handleOnClick = async () => {
    if (!connection || !publicKey) return;
  };

  return (
    <main className="container mx-auto">
      <section className="mb-12">
        <h1 className="text-3xl md:text-5xl mb-2">Token</h1>
        <button onClick={handleOnClick}>DO IT</button>
      </section>
    </main>
  );
};

export default Token;
