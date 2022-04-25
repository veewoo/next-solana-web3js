import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import React from "react";

type FooterProps = {};

const Footer = ({}: FooterProps) => {
  return (
    <footer className="text-center mt-auto py-4">
      <a
        href="https://github.com/veewoo"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>Powered by </span>
        <span> VeeWoo</span>
      </a>
    </footer>
  );
};

export default React.memo(Footer);
