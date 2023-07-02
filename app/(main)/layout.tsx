"use client";

import AuthProvider from "@/firebase/AuthProvider";
import LicenseProvider from "@/firebase/LicenseProvider";
import { MantineProvider } from "@mantine/core";
import React, { ReactNode } from "react";

export default function LayoutMain({ children }: { children: ReactNode }) {
	return (
		// <MantineProvider withNormalizeCSS withGlobalStyles>
			<AuthProvider>
				<LicenseProvider>{children}</LicenseProvider>
			</AuthProvider>
		// </MantineProvider>
	);
}
