import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState, useCallback } from "react";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useChainAdapter } from "@/hooks/useChainAdapter";
import { ChainControls } from "@/components/chainControl";
import { useChain } from "@/components/providers/chainProvider";

const REFRESH_INTERVAL = 5 * 60 * 1000;

function CyberPunkInfoCard() {
  const { publicKey, disconnect, connecting, connected, wallet } = useWallet();

  const { setVisible } = useWalletModal();
  const chainAdapter = useChainAdapter();
  const { currentChain, currentNetwork } = useChain();
  const chainConfig = chainAdapter.chainConfig;

  const [balance, setBalance] = useState<number | null>(null);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL / 1000);

  const handleConnectWallet = () => {
    if (connected) {
      disconnect();
    } else {
      setVisible(true);
    }
  };

  const fetchBalance = useCallback(async () => {
    if (!publicKey) return;

    const connection = new Connection(
      chainConfig.networks[currentNetwork]!.rpcEndpoint
    );

    try {
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
      setCountdown(REFRESH_INTERVAL / 1000);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  }, [publicKey, chainConfig.networks]);

  const fetchSolPrice = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT"
      );
      const data = await response.json();
      setSolPrice(parseFloat(data.price));
    } catch (error) {
      console.error("Error fetching SOL price:", error);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
    fetchSolPrice();
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : REFRESH_INTERVAL / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [fetchBalance, fetchSolPrice]);

  useEffect(() => {
    if (countdown === 0) {
      fetchBalance();
      fetchSolPrice();
    }
  }, [countdown, fetchBalance, fetchSolPrice]);

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      toast.success("Copied to clipboard");
    }
  };

  if (!connected && connecting) return <Skeleton />;
  if (!wallet) return <NoWallet handleConnectWallet={handleConnectWallet} />;

  return (
    <div className="relative group">
      {/* Animated border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 via-emerald-300 to-green-500 opacity-75 blur group-hover:opacity-100 transition duration-1000 animate-gradient-xy"></div>

      <div
        className="relative p-5 grid gap-5 border border-[#03B500] text-white bg-[#111411] overflow-hidden"
        style={{
          clipPath: "polygon(5% 0%, 100% 0, 100% 80%, 95% 100%, 0 100%, 0 20%)",
        }}
      >
        {/* Cyber grid background */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(#03B500 1px, transparent 1px), linear-gradient(90deg, #03B500 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-green-500" />
        <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-green-500" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-green-500" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-green-500" />

        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href={"/profile"}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Image
                src="/icons/user-icon.svg"
                width={25}
                height={25}
                alt="user"
                className="mr-2 w-10 h-10 cursor-pointer hover:drop-shadow-[0_0_8px_rgba(47,255,43,0.8)]"
              />
            </motion.div>
          </Link>

          <Tooltip>
            <TooltipTrigger>
              <motion.p
                onClick={copyAddress}
                className="text-xs sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {publicKey ? shortenAddress(publicKey.toBase58(), 4) : "..."}
              </motion.p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{publicKey?.toBase58()}</p>
            </TooltipContent>
          </Tooltip>

          <motion.p
            className="ml-2 text-xs text-green-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            ({currentChain}) ({currentNetwork})
          </motion.p>

          <motion.div
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Image
              src={"/icons/logout.svg"}
              width={30}
              height={30}
              alt="Logout"
              className="ml-auto w-10 h-10 cursor-pointer hover:drop-shadow-[0_0_8px_rgba(47,255,43,0.8)]"
              onClick={disconnect}
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="flex gap-3 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <motion.div
            className="flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src={"/icons/solana.svg"}
              width={25}
              height={25}
              alt="SOL icon"
              className="mr-1 hover:drop-shadow-[0_0_8px_rgba(47,255,43,0.8)]"
            />
            <span className="text-green-400">Sol</span>
          </motion.div>

          <div className="flex items-center justify-center">
            <motion.span
              className="text-3xl font-bold text-white drop-shadow-[0_0_8px_rgba(47,255,43,0.5)]"
              animate={{
                opacity: [1, 0.8, 1],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {balance !== null ? balance.toFixed(2) : "..."}
            </motion.span>
            <span className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl mx-1 text-green-400">
              ~ $
            </span>
            <span className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-green-300">
              {balance !== null && solPrice !== null
                ? (balance * solPrice).toFixed(2)
                : "..."}
            </span>
          </div>

          <Link href="/leaderboard" className="flex-1">
            <motion.button
              className="w-full bg-[#181716] border-2 border-[#2A342A] text-white py-1 px-2 text-sm font-semibold uppercase tracking-wider transition-all relative group overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/20 to-green-500/0 group-hover:translate-x-full transition-transform duration-500"></div>
              Leaderboard
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

const NoWallet = ({
  handleConnectWallet,
}: {
  handleConnectWallet: () => void;
}) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 via-emerald-300 to-green-500 opacity-50 blur group-hover:opacity-75 transition duration-1000 animate-gradient-xy"></div>

      <div
        className="relative p-5 grid gap-3 border-[#03B500] border text-white bg-[#111411] items-center overflow-hidden"
        style={{
          clipPath: "polygon(5% 0%, 100% 0, 100% 80%, 95% 100%, 0 100%, 0 20%)",
        }}
      >
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(#03B500 1px, transparent 1px), linear-gradient(90deg, #03B500 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="w-full bg-[#181716] border border-[#2A342A] text-white py-1 px-2 text-sm font-semibold uppercase tracking-wider">
            No wallet connected
          </p>
        </motion.div>

        <motion.button
          className="relative bg-[#111411] border border-[#03B500] border-opacity-50 p-2 text-white text-lg transition-all duration-300 ease-in-out overflow-hidden group"
          onClick={handleConnectWallet}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/20 to-green-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span className="relative z-10">Click to connect wallet</span>
        </motion.button>
      </div>
    </div>
  );
};

const Skeleton = () => {
  return (
    <div className="relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 via-emerald-300 to-green-500 opacity-30 blur animate-pulse"></div>

      <div
        className="relative p-5 grid gap-5 border-[#03B500] border bg-[#111411] overflow-hidden"
        style={{
          clipPath: "polygon(5% 0%, 100% 0, 100% 80%, 95% 100%, 0 100%, 0 20%)",
        }}
      >
        <div className="flex items-center animate-pulse">
          <div className="w-10 h-10 bg-green-700/30 rounded-full mr-2"></div>
          <div className="h-6 w-32 bg-green-700/30 rounded"></div>
          <div className="ml-auto w-10 h-10 bg-green-700/30 rounded"></div>
        </div>
        <div className="flex gap-3 animate-pulse">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 bg-green-700/30 rounded-full mr-2"></div>
            <div className="h-4 w-8 bg-green-700/30 rounded"></div>
          </div>
          <div className="flex items-center justify-center">
            <div className="h-8 w-20 bg-green-700/30 rounded mr-2"></div>
            <div className="h-6 w-24 bg-green-700/30 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export default CyberPunkInfoCard;
