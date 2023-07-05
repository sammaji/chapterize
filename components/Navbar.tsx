"use client";

import { useLicenseInfo } from "@/firebase/LicenseProvider";
import { useAuth } from "../firebase/AuthProvider";
import { BiCheck } from "react-icons/bi";
import { FilledButton, OutlinedButton } from "./Button";

export default function Navbar() {
	const { user, authenticate, signout } = useAuth();
	const { isSubscriptionActive, isSubscriptionCancelled, subscriptionId } =
		useLicenseInfo();

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
			if (checkout_url) window.location.href = checkout_url;
			else throw new Error("Invalid Checkout Url");
		} catch (err) {
			console.error(err);
		}
	};

	async function cancelSubscription(subscriptionId: string) {
		await fetch(
			`https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}`,
			{
				method: "PATCH",
				headers: {
					Accept: "application/vnd.api+json",
					"Content-Type": "application/vnd.api+json",
					Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
				},
				body: JSON.stringify({
					data: {
						type: "subscriptions",
						id: subscriptionId,
						attributes: {
							cancelled: true,
						},
					},
				}),
			}
		);
	}

	return (
		<div className="h-[56px] w-[100%] flex items-center justify-end px-8 gap-2">
			<h2 className="text-black flex items-center justify-center gap-1">
				<OutlinedButton
					hidden={isSubscriptionActive && !isSubscriptionCancelled}
					disabled={true}
				>
					<BiCheck />
					{"Pro"}
				</OutlinedButton>
			</h2>

			<FilledButton className={user ? "hidden" : ""} onClick={handleAuth}>
				Login / Signup
			</FilledButton>
			<OutlinedButton className={user ? "" : "hidden"} onClick={handleSignOut}>
				Sign Out
			</OutlinedButton>
			<FilledButton
				className={
					user && (!isSubscriptionActive || isSubscriptionCancelled)
						? ""
						: "hidden"
				}
				onClick={handleSubscription}
			>
				Purchase
			</FilledButton>
			<FilledButton
				className={
					user && !(!isSubscriptionActive || isSubscriptionCancelled)
						? ""
						: "hidden"
				}
				onClick={() => {
					cancelSubscription(subscriptionId)
						.then(() => {
							alert("Your subscription is cancelled");
						})
						.catch(() => {
							alert(
								"Some unexpected error occurred. Please try again after some time."
							);
						});
				}}
			>
				Cancel Subscription
			</FilledButton>
		</div>
	);
}
