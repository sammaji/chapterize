"use client"

import AuthProvider from "@/firebase/AuthProvider";
import LicenseProvider from "@/firebase/LicenseProvider";
import React, { ReactNode } from "react";

export default function LayoutMain({ children }: { children: ReactNode }) {
	return (
		<AuthProvider>
			<LicenseProvider>{children}</LicenseProvider>
		</AuthProvider>
	);
}
