import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body
				className={`${poppins.className} overflow-x-hidden overflow-y-scroll scroll-smooth bg-[#f1f5f9]`}
			>
				{children}
			</body>
		</html>
	);
}
