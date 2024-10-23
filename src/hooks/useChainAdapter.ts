import { useChain } from "@/components/providers/chainProvider";

export function useChainAdapter() {
  const { currentChain, currentNetwork, chainManager } = useChain();
  const adapter = chainManager.getAdapter(currentChain);
  adapter.setNetwork(currentNetwork);
  return adapter;
}
