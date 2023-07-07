import {
	getSubscriptionId,
	isSubscriptionActive,
	isSubscriptionCancelled
} from "@/lib/subscription";
import React, {
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState
} from "react";
import { useAuth } from "./AuthProvider";
import { useSetState } from "@mantine/hooks";

interface LicenseContextProps {
	isSubscriptionActive: boolean;
	isSubscriptionCancelled: boolean;
	subscriptionId: string;
}

const LicenseContext = createContext<LicenseContextProps>(null!);
export const useLicenseInfo = () => useContext(LicenseContext);

export default function LicenseProvider({ children }: { children: ReactNode }) {
	const { user, isUserChanged } = useAuth();
	const [subscriptionActive, setSubscriptionActiveStatus] =
		useState<boolean>(false);
	const [subscriptionCancelled, setSubscriptionCancelledStatus] =
		useState<boolean>(false);
	const [subscriptionId, setSubscriptionId] = useState<string>("");

	useEffect(() => {
		if (user) {
			isSubscriptionActive(user.uid).then((result: boolean) => {
				setSubscriptionActiveStatus(result);
				isSubscriptionCancelled(user.uid).then((result_cancelled: boolean) => {
					setSubscriptionCancelledStatus(result_cancelled);
				});

				getSubscriptionId(user.uid).then((s_id: string) => {
					setSubscriptionId(s_id);
				});
			});
		}
	}, [isUserChanged]);

	const subscriptionStatus: LicenseContextProps = {
		isSubscriptionActive: subscriptionActive,
		isSubscriptionCancelled: subscriptionCancelled,
		subscriptionId: subscriptionId
	};

	return (
		<LicenseContext.Provider value={subscriptionStatus}>
			{children}
		</LicenseContext.Provider>
	);
}
