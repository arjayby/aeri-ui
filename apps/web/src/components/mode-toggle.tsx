"use client";

import { Button } from "@aeri-ui/ui/components/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ModeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isDark = !mounted || resolvedTheme === "dark";

	return (
		<Button
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
			className="rounded-full"
			onClick={() => setTheme(isDark ? "light" : "dark")}
			size="icon"
			type="button"
			variant="ghost"
		>
			{isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
		</Button>
	);
}
