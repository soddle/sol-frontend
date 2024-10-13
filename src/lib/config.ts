import { ChainConfig } from "./chains/types";
// idl
import solanaIdl from "@/lib/idl/svm/solana.json";
import eclipseIdl from "@/lib/idl/svm/eclipse.json";
import ethereumAbi from "@/lib/idl/evm/ethereum.json";
import blastAbi from "@/lib/idl/evm/blast.json";
import { Idl } from "@coral-xyz/anchor";

// Define supported chains
export type SupportedChain =
  | "solana"
  | "ethereum"
  | "base"
  | "eclipse"
  | "blast";

// Environment types
type Environment = "development" | "production" | "test";

// Base configuration
interface BaseConfig {
  environment: Environment;
  baseUrl: string;
  apiBaseUrl: string;
}

// Chain-specific configuration
type ChainConfigs = {
  [key in SupportedChain]: ChainConfig;
};

//  App configuration
interface AppConfig extends BaseConfig {
  chains: ChainConfigs;
}

// Helper function to get the current environment
const getEnvironment = (): Environment => {
  switch (process.env.NODE_ENV) {
    case "production":
      return "production";
    case "test":
      return "test";
    default:
      return "development";
  }
};

// Configuration for different environments
const environmentConfigs: Record<Environment, BaseConfig> = {
  development: {
    environment: "development",
    baseUrl: "http://localhost:3000",
    apiBaseUrl: "https://soddle-solana-production.up.railway.app",
  },
  production: {
    environment: "production",
    baseUrl: "https://demo.soddle.io",
    apiBaseUrl: "https://soddle-solana-production.up.railway.app",
  },
  test: {
    environment: "test",
    baseUrl: "http://localhost:3000",
    apiBaseUrl: "https://soddle-solana-test.up.railway.app",
  },
};

const chainConfigs: ChainConfigs = {
  // svm
  solana: {
    rpcEndpoint: "https://api.mainnet-beta.solana.com",
    idl: solanaIdl as Idl,
    contractAddresses: {
      game: "SoddleGameAddress123...",
    },
  },
  eclipse: {
    rpcEndpoint: "https://rpc.eclipse.io",
    idl: eclipseIdl as Idl,
    contractAddresses: {
      game: "EclipseGameAddress123...",
    },
  },

  // evm
  ethereum: {
    rpcEndpoint: "https://mainnet.infura.io/v3/YOUR-PROJECT-ID",
    chainId: 1, // Mainnet
    abi: ethereumAbi,
    contractAddresses: {
      game: "0xSoddleGameAddress...",
    },
  },
  blast: {
    rpcEndpoint: "https://rpc.blast.io",
    chainId: 168587773, // Blast chainId
    contractAddresses: {
      game: "0xBlastGameAddress...",
    },
  },
  base: {
    rpcEndpoint: "https://mainnet.base.org",
    chainId: 8453, // Base Mainnet
    contractAddresses: {
      game: "0xSoddleGameAddressOnBase...",
    },
  },
};

// the final configuration
const currentEnv = getEnvironment();
export const appConfig: AppConfig = {
  ...environmentConfigs[currentEnv],
  chains: chainConfigs,
};

// Export a type-safe function to get chain config
export function getChainConfig(chain: SupportedChain): ChainConfig {
  return appConfig.chains[chain];
}

export { chainConfigs };
