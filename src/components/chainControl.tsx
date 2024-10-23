import React from "react";
import { useChain } from "@/components/providers/chainProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SupportedChain } from "@/lib/chains/types";

export const ChainControls: React.FC = () => {
  const {
    currentChain,
    currentNetwork,
    setCurrentChain,
    setCurrentNetwork,
    chainManager,
  } = useChain();
  const supportedChains = chainManager.getSupportedChains();
  const adapter = chainManager.getAdapter(currentChain);
  const supportedNetworks = Object.keys(adapter.chainConfig.networks);

  const handleChainChange = (chain: SupportedChain) => {
    setCurrentChain(chain);
    // Reset network to the first available network for the new chain
    const newAdapter = chainManager.getAdapter(chain);
    const newNetworks = Object.keys(newAdapter.chainConfig.networks);
    // setCurrentNetwork(newNetworks[chain]);
  };

  return (
    <div className="flex space-x-4">
      <div>
        <h3 className="mb-2 text-sm font-medium">Chain</h3>
        <Select value={currentChain} onValueChange={handleChainChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select chain" />
          </SelectTrigger>
          <SelectContent>
            {supportedChains.map((chain) => (
              <SelectItem key={chain} value={chain}>
                {chain}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium">Network</h3>
        <Select value={currentNetwork} onValueChange={setCurrentNetwork}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select network" />
          </SelectTrigger>
          <SelectContent>
            {supportedNetworks.map((network) => (
              <SelectItem key={network} value={network}>
                {network}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
