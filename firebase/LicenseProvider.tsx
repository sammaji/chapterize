import {
	isSubscriptionActive,
	isSubscriptionCancelled,
} from "@/lib/subscription";
import React, {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { useAuth } from "./AuthProvider";

interface LicenseContextProps {
	isSubscriptionActive: boolean;
	isSubscriptionCancelled: boolean;
}

const LicenseContext = createContext<LicenseContextProps>({
	isSubscriptionActive: false,
	isSubscriptionCancelled: false,
});
export const useLicenseInfo = () => useContext(LicenseContext);

export default function LicenseProvider({ children }: { children: ReactNode }) {
	const { user } = useAuth();
	const [subscriptionActive, setSubscriptionActiveStatus] =
		useState<boolean>(false);
	const [subscriptionCancelled, setSubscriptionCancelledStatus] =
		useState<boolean>(false);

	useEffect(() => {
		if (user) {
			isSubscriptionActive(user.uid).then((result: boolean) => {
				setSubscriptionActiveStatus(result);
				isSubscriptionCancelled(user.uid).then((result_cancelled: boolean) => {
					setSubscriptionCancelledStatus(result_cancelled);
				});
			});
		}
	}, [user]);

	const subscriptionStatus: LicenseContextProps = {
		isSubscriptionActive: subscriptionActive,
		isSubscriptionCancelled: subscriptionCancelled,
	};

	return (
		<LicenseContext.Provider value={subscriptionStatus}>
			{children}
		</LicenseContext.Provider>
	);
}
