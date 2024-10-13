import { useChain } from "@/components/providers/chainProvider";

export function useChainAdapter() {
  const { currentChain, chainManager } = useChain();
  return chainManager.getAdapter(currentChain);
}
