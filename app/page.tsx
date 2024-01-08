//@ts-nocheck
"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { use, useEffect, useState } from "react";
import ScratchCard from "react-scratchcard-v2";
import axios from "axios";
import toast from "react-hot-toast";
import { wallets } from "./wallets";

function truncateWalletAddress(address: string, length = 8) {
  if (address.length <= length * 2) {
    return address; // Return the original address if it's too short to truncate
  }
  return `${address.substring(0, length)}...${address.substring(
    address.length - length
  )}`;
}

const endpoint =
  "https://rpc.hellomoon.io/2aac76c6-9590-400a-bfbb-1411c9716810";

const WalletMultiButtonNoSSR = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

export default function Home() {
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const [showprize, setshowprize] = useState(false);
  const [prize, setprize] = useState("nothing");
  const [playKey, setPlayKey] = useState(0);
  const [scratches, setScratches] = useState(0);
  const [initialScratch, setInitialScratch] = useState(0); // localStorage[publicKey.toString()
  const [scratchesUsed, setScratchesUsed] = useState(
    typeof window !== "undefined"
      ? parseInt(localStorage.getItem(publicKey?.toBase58()), 10) || 0
      : 0
  );

  const getScratches = (walletAddress: string) => {
    const userWallet = wallets.find(
      (wallet) => wallet.Wallet === walletAddress
    );
    return userWallet ? userWallet.Scratches : 0;
  };

  async function getRandomPrize() {
    try {
      // Replace 'your-endpoint-url' with the actual URL of your endpoint
      const response = await axios.get("/api/get-prize");

      if (response.data && !response.data.error) {
        updateScratches();
        return response.data.prize;
      } else {
        console.error("Error fetching prize");
        return null;
      }
    } catch (error) {
      console.error("Error during API call:", error);
      return null;
    }
  }

  const result = async () => {
    getRandomPrize().then((prize) => {
      if (prize !== "nothing") {
        console.log("You won:", prize);
        setshowprize(true);
        setprize(prize);
        toast.success("You won " + prize);
      } else {
        setshowprize(true);
        setprize(prize);
        toast.error("No prize won");
        console.log("No prize won");
      }
    });
  };

  const playAgin = async () => {
    setshowprize(false);
    setprize("nothing");
    setPlayKey(playKey + 1);
  };

  const updateScratches = () => {
    if (typeof window !== "undefined" && publicKey) {
      const walletAddress = publicKey.toString();
      let currentScratches = parseInt(localStorage.getItem(walletAddress), 10);

      if (currentScratches > 0) {
        currentScratches--;
        localStorage.setItem(walletAddress, currentScratches.toString());
        setScratches(currentScratches);
        setScratchesUsed((prev) => prev + 1);
      } else {
        toast.error("No scratches remaining.");
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && publicKey) {
      if (publicKey) {
        const walletAddress = publicKey.toString();
        const isFirstConnection =
          localStorage.getItem(walletAddress + "_first_conn") === null;
        const totalScratchCount = getScratches(walletAddress);
        let scratchesUsed = parseInt(localStorage.getItem(walletAddress), 10);

        if (isFirstConnection) {
          // First connection, set the initial value
          scratchesUsed = totalScratchCount;
          localStorage.setItem(walletAddress, scratchesUsed.toString());
          localStorage.setItem(walletAddress + "_first_conn", "false");
        } else if (isNaN(scratchesUsed)) {
          // If there's no data in localStorage, initialize it
          scratchesUsed = 0;
          localStorage.setItem(walletAddress, "0");
        }

        setScratchesUsed(scratchesUsed);
        setInitialScratch(totalScratchCount);
        setScratches(totalScratchCount - scratchesUsed);
      }
    }
  }, [publicKey, showprize]);

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden text-white bg-black bg-cover">
      CLOSED
    </main>
  );
}
