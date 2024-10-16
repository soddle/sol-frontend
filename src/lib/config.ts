import { ChainConfig, SupportedChain } from "./chains/types";
import { Idl } from "@coral-xyz/anchor";
import { clusterApiUrl } from "@solana/web3.js";
import { blastAbi, eclipseIdl, ethereumAbi, solanaIdl } from "./constants";

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
  SOLANA: {
    networks: {
      "mainnet-beta": {
        rpcEndpoint: "https://api.mainnet-beta.solana.com",
        cluster: "mainnet-beta",
      },
      devnet: {
        rpcEndpoint: "https://api.devnet.solana.com",
        cluster: "devnet",
      },
      testnet: {
        rpcEndpoint: "https://api.testnet.solana.com",
        cluster: "testnet",
      },
    },
    defaultNetwork: "mainnet-beta",
    idl: solanaIdl as Idl,
    contractAddresses: {
      game: "4DJ2RtFHVUNgtZTNhioSBHnKqUqBeCbHfy6L1z6HqkjZ",
    },
  },
  ECLIPSE: {
    networks: {
      "mainnet-beta": {
        rpcEndpoint: "https://mainnetbeta-rpc.eclipse.xyz",
        cluster: "mainnet-beta",
      },
      devnet: {
        rpcEndpoint: "https://staging-rpc.dev2.eclipsenetwork.xyz",
      },
      testnet: {
        rpcEndpoint: "https://testnet.dev2.eclipsenetwork.xyz",
        cluster: "testnet",
      },
    },
    defaultNetwork: "mainnet-beta",
    idl: eclipseIdl as Idl,
    contractAddresses: {
      game: "0xEclipseGameAddress123...",
    },
  },
  ETHEREUM: {
    networks: {
      mainnet: {
        rpcEndpoint: "https://mainnet.infura.io/v3/PROJECT-ID",
        chainId: 1,
      },
      sepolia: {
        rpcEndpoint: "https://goerli.infura.io/v3/PROJECT-ID",
        chainId: 5,
      },
    },
    defaultNetwork: "sepolia",
    abi: ethereumAbi,
    contractAddresses: {
      game: "0xSoddleGameAddress...",
    },
  },
  BLAST: {
    networks: {
      mainnet: {
        rpcEndpoint: "https://rpc.blast.io",
        chainId: 168587773,
      },
      sepolia: {
        rpcEndpoint: "https://goerli.infura.io/v3/PROJECT-ID",
        chainId: 5,
      },
    },
    defaultNetwork: "sepolia",
    abi: blastAbi,
    contractAddresses: {
      game: "0xBlastGameAddress...",
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
