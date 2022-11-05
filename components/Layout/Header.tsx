import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";

const WalletDisconnectButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletDisconnectButton,
  { ssr: false }
);

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const PATHS = [
  { path: "/", name: "DApp #1" },
  { path: "/nft-gallery", name: "NFT Gallery" },
];

const Header = () => {
  const router = useRouter();

  return (
    <header className="container flex items-center justify-between py-4 mx-auto mb-8">
      <h2 className="text-3xl">Veewoo&apos;s DApp</h2>
      <div className="flex flex-wrap items-center justify-center button-group">
        <select
          className="border-2 border-purple-900 text-purple-900 hover:text-white hover:bg-purple-900 rounded h-12 px-4"
          value={router.asPath}
          onChange={(e) => window.location.assign(e.target.value)}
        >
          {PATHS.map((item, index) => (
            <option key={"path-" + index} value={item.path}>
              {item.name}
            </option>
          ))}
        </select>
        <WalletMultiButtonDynamic />
        <WalletDisconnectButtonDynamic />
      </div>
    </header>
  );
};

export default Header;
