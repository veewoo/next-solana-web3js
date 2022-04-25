import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import React from "react";

type HeaderProps = {};

const Header = ({}: HeaderProps) => {
  return (
    <header className="container flex justify-between py-4 mx-auto mb-8">
      <h2 className="text-3xl">Veewoo's DApp</h2>
      <div className="flex flex-wrap items-center justify-center button-group">
        <select className="border-2 border-purple-900 text-purple-900 hover:text-white hover:bg-purple-900 rounded h-12 px-4">
          <option value="1">DApp #1</option>
          <option value="2">DApp #2</option>
        </select>
        <WalletMultiButton />
        <WalletDisconnectButton />
      </div>
    </header>
  );
};

export default React.memo(Header);
