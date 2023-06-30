import { useLicenseInfo } from "@/firebase/LicenseProvider";
import { useAuth } from "../firebase/AuthProvider";
import { BiCheck } from "react-icons/bi";

export default function Navbar() {
	const { user, authenticate, signout } = useAuth();
	const { isSubscriptionActive, isSubscriptionCancelled } = useLicenseInfo();

	const handleAuth = () => {
		authenticate();
	};

	const handleSignOut = () => {
		signout();
	};

	const handleSubscription = async () => {
		if (!user) {
			alert("Please Sign Up First");
			return;
		}

		try {
			const response = await fetch("/api/checkout", {
				method: "POST",
				body: JSON.stringify({ uid: user.uid, email: user.email }),
			});

			const checkout_url = (await response.json()).checkout_url;
			if (checkout_url) window.open(checkout_url);
			else throw new Error("Invalid Checkout Url");
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="h-[56px] w-[100%] flex items-center justify-end px-8 gap-2">
			<h2 className="text-black flex items-center justify-center gap-1">
				{isSubscriptionActive && !isSubscriptionCancelled ? (
					<>
						<BiCheck />
						{"Pro"}
					</>
				) : (
					""
				)}
			</h2>
			{!user ? (
				<button
					className="bg-black text-white h-[36px] px-4 text-sm rounded-xl"
					onClick={handleAuth}
				>
					Login / Signup
				</button>
			) : (
				<>
					<button
						className="text-black bg-transparent hover:bg-slate-200 h-[36px] px-4 text-sm rounded-xl"
						onClick={handleSignOut}
					>
						Sign Out
					</button>
					<button
						className="bg-black text-white h-[36px] px-4 text-sm rounded-xl"
						onClick={handleSubscription}
					>
						Purchase
					</button>
				</>
			)}
		</div>
	);
}
