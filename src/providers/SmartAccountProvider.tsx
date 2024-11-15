import { useCreateKlaster } from "@/hooks/useCreateKlaster";
import type { BiconomyV2AccountInitData, KlasterSDK } from "klaster-sdk";
import { createContext, useContext, type PropsWithChildren } from "react";

const KlasterContext = createContext<{
	klasterAccount: KlasterSDK<BiconomyV2AccountInitData> | null;
}>({
	klasterAccount: null,
});

export const KlasterProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const klasterAccount = useCreateKlaster();

	if (!klasterAccount) {
		return null;
	}

	return (
		<KlasterContext.Provider value={{ klasterAccount }}>
			{children}
		</KlasterContext.Provider>
	);
};

export const useKlaster = () => {
	const { klasterAccount } = useContext(KlasterContext);
	if (!klasterAccount) {
		throw new Error("useKlaster must be used within a KlasterProvider");
	}
	return klasterAccount;
};
