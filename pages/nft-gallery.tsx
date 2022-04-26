import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";

type NftUri = {
  uri: string;
  mint: string;
};

type NFT = {
  mint: string;
  name: string;
  image: string;
  properties: {
    files: { uri: string; type: string }[];
    category: string;
  };
};

const NftGallery: NextPage = () => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [nftURIs, setNftURIs] = useState<NftUri[]>([]);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [pubKey, setPubKey] = useState<string>("");

  const { connection } = useConnection();

  useEffect(() => {
    if (!isValidPublicKey(pubKey)) {
      setNftURIs([]);
      return;
    }

    // Get an array of nft URIs
    // when a user input a new valid key
    getParsedNftAccountsByOwner({
      publicAddress: pubKey,
      connection,
    }).then((arr) => {
      if (!Array.isArray(arr)) return;
      setNftURIs(
        arr.map((item) => ({
          mint: item.mint,
          uri: item.data.uri,
        }))
      );
    });
  }, [connection, pubKey]);

  // Get the first page of nft list
  // when a user input a new valid key
  useEffect(() => {
    setNfts([]);
    fetchNfts();
  }, [nftURIs]);

  const fetchNfts = async () => {
    console.log("fetchNfts start", nfts, nftURIs, isFetching);
    if (nfts.length >= nftURIs.length || isFetching) return;

    setIsFetching(true);

    const tempArray: NFT[] = [...nfts];
    const length =
      tempArray.length + Math.min(nftURIs.length - tempArray.length, 10);

    for (let i = tempArray.length; i < length; i++) {
      const res = await axios.get(nftURIs[i].uri);

      tempArray.push({
        mint: nftURIs[i].mint,
        name: res.data.name,
        image: res.data.image,
        properties: {
          files: res.data.properties.files,
          category: res.data.properties.category,
        },
      });

      setNfts([...tempArray]);
    }

    setIsFetching(false);
    console.log("fetchNfts end", nfts, nftURIs, isFetching);
  };

  const handleScroll = () => {
    if (
      !isFetching &&
      window.innerHeight + window.scrollY > document.body.scrollHeight - 100
    ) {
      fetchNfts();
    }
  };

  // Fetch the nft infomation when an user scroll to the bottom of the page
  useEffect(() => {
    window.addEventListener("wheel", handleScroll);
    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [nfts, nftURIs, isFetching]);

  return (
    <main className="container mx-auto">
      <section className="">
        <input
          className="text-black"
          type="text"
          placeholder="Public Key"
          value={pubKey}
          onChange={(e) => setPubKey(e.target.value)}
        />
      </section>
      <section className="overflow-hidden text-gray-700">
        <div className="container py-2 mx-auto lg:pt-12">
          <div className="flex flex-wrap -m-1 md:-m-2">
            {nfts.map((nft, index) => (
              <div className="flex flex-wrap w-1/5" key={"nft-" + index}>
                <div className="w-full p-1 md:p-2">
                  <img
                    alt="gallery"
                    className="block object-cover object-center w-full h-full rounded-lg"
                    src={nft.image}
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
            {nftURIs.length > 0 && nfts.length < nftURIs.length && !isFetching && (
              <div className="flex flex-wrap w-1/5">
                <div className="w-full p-1 md:p-2">
                  <button className="text-white" onClick={fetchNfts}>
                    Show more
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

function isValidPublicKey(str: string) {
  try {
    new PublicKey(str || "");
    return true;
  } catch (error) {
    return false;
  }
}

export default NftGallery;
