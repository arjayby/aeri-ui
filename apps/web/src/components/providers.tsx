"use client";

import { Toaster } from "@aeri-ui/ui/components/sonner";
import { RootProvider } from "fumadocs-ui/provider/next";

import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<RootProvider search={{ enabled: false }} theme={{ enabled: false }}>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				{children}
				<Toaster richColors />
			</ThemeProvider>
		</RootProvider>
	);
}
