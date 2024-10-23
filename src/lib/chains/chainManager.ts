import {
  ChainAdapter,
  SVMChainAdapter,
  EVMChainAdapter,
  SupportedChain,
} from "./types";
import { SolanaAdapter } from "./svm/solanaAdapter";
import { EthereumAdapter } from "./evm/ethereumAdapter";
import { EclipseAdapter } from "@/lib/chains/svm/eclipseAdapter";
import { BlastAdapter } from "@/lib/chains/evm/blastAdapter";
import { chainConfigs } from "@/lib/config";

export class ChainManager {
  private adapters: Map<SupportedChain, ChainAdapter> = new Map();

  constructor() {
    Object.entries(chainConfigs).forEach(([chain, config]) => {
      switch (chain) {
        case "SOLANA":
          this.adapters.set(chain, new SolanaAdapter(config));
          break;
        case "ETHEREUM":
          this.adapters.set(chain, new EthereumAdapter(config));
          break;
        case "ECLIPSE":
          this.adapters.set(chain, new EclipseAdapter(config));
          break;
        case "BLAST":
          this.adapters.set(chain, new BlastAdapter(config));
          break;
      }
    });
  }

  // getIdl(chain: string): any {
  //   switch (chain.toLowerCase()) {
  //     case "solana":
  //       return solanaIdl;
  //     case "eclipse":
  //       return eclipseIdl;
  //     case "ethereum":
  //       return ethereumIdl;
  //     case "blast":
  //       return blastIdl;
  //     default:
  //       throw new Error(`Unsupported chain: ${chain}`);
  //   }
  // }

  getAdapter = (chain: SupportedChain): ChainAdapter => {
    const adapter = this.adapters.get(chain);
    if (!adapter) {
      throw new Error(`Unsupported chain: ${chain}`);
    }
    return adapter;
  };

  getSupportedChains = (): SupportedChain[] => {
    return Array.from(this.adapters.keys());
  };

  isSVMChain = (chain: SupportedChain): boolean => {
    const adapter = this.getAdapter(chain);
    return "signAndSendSVMTransaction" in adapter;
  };

  isEVMChain = (chain: SupportedChain): boolean => {
    const adapter = this.getAdapter(chain);
    return "signAndSendEVMTransaction" in adapter;
  };

  signAndSendTransaction = async (
    chain: SupportedChain,
    transaction: any
  ): Promise<string> => {
    const adapter = this.getAdapter(chain);
    if (this.isSVMChain(chain)) {
      return (adapter as SVMChainAdapter).signAndSendSVMTransaction(
        transaction
      );
    } else if (this.isEVMChain(chain)) {
      return (adapter as EVMChainAdapter).signAndSendEVMTransaction(
        transaction
      );
    }
    throw new Error(`Unsupported chain type: ${chain}`);
  };
}
