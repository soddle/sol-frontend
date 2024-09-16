"use client";
import { ConnectWalletButton } from "@/components/connectButton";
import Container from "@/components/layout/container";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function LandingPage() {
  const wallet = useWallet();
  const router = useRouter();
  useEffect(() => {
    console.log("user wallet pub key: ", wallet.connected || wallet.publicKey);
    if (wallet.publicKey) {
      router.push("/play");
    }
  }, [wallet, router]);
  return (
    <Container className="flex-grow flex items-center justify-center ">
      {/* <ConnectWalletButton /> */}
      <WalletMultiButton />
    </Container>
  );
}

export default LandingPage;
