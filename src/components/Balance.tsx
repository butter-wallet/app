import { useUnifiedBalance } from "@/hooks/useUnifiedBalance";
import { SupportedToken, tokenMappings } from "@/lib/klaster";
import { formatUnits } from "viem";
import { useMemo } from "react";

export const Balance = () => {
  // Fetch stablecoin balances
  const usdcBalance = useUnifiedBalance(
    SupportedToken.USDC,
    tokenMappings[SupportedToken.USDC].addresses
  );

  const usdtBalance = useUnifiedBalance(
    SupportedToken.USDT,
    tokenMappings[SupportedToken.USDT].addresses
  );

  // Fetch ETH balance
  const ethBalance = useUnifiedBalance(
    SupportedToken.ETH,
    tokenMappings[SupportedToken.ETH].addresses
  );

  // Calculate total USD value (USDC + USDT + ETH)
  const totalUsdValue = useMemo(() => {
    const usdc = BigInt(usdcBalance.data?.balance || '0');
    const usdt = BigInt(usdtBalance.data?.balance || '0');
    const eth = BigInt(ethBalance.data?.balance || '0');
    return usdc + usdt + eth;
  }, [
    usdcBalance.data?.balance,
    usdtBalance.data?.balance,
    ethBalance.data?.balance
  ]);

  // Loading state
  if (usdcBalance.isLoading || usdtBalance.isLoading || ethBalance.isLoading) {
    return <div className="text-2xl font-bold">Loading...</div>;
  }

  // Error state
  if (usdcBalance.error || usdtBalance.error || ethBalance.error) {
    return <div>Error loading balances</div>;
  }

  return (
    <div className="text-2xl font-bold">
      ${formatUnits(totalUsdValue, 6)}
    </div>
  );
};