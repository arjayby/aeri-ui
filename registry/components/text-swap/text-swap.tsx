"use client";

import * as React from "react";

type TextSwapProps = Omit<React.ComponentPropsWithRef<"span">, "children"> & {
	content: number | string;
	contentKey: React.Key;
	reducedMotion?: boolean;
};

function getTextWidth(element: HTMLElement) {
	const range = document.createRange();
	range.selectNodeContents(element);
	return range.getBoundingClientRect().width;
}

const TextSwap = React.forwardRef<HTMLSpanElement, TextSwapProps>(
	function TextSwap(
		{
			"aria-atomic": ariaAtomic = true,
			"aria-live": ariaLive = "polite",
			className,
			content,
			contentKey,
			reducedMotion = false,
			role = "status",
			style,
			...props
		},
		ref,
	) {
		const incomingRef = React.useRef<HTMLSpanElement>(null);
		const interruptedWidth = React.useRef<number | undefined>(undefined);
		const layoutRef = React.useRef<HTMLSpanElement>(null);
		const outgoingRef = React.useRef<HTMLSpanElement>(null);
		const previousContent = React.useRef({ content, key: contentKey });
		const rootRef = React.useRef<HTMLSpanElement>(null);
		const changed = previousContent.current.key !== contentKey;

		React.useImperativeHandle(ref, () => rootRef.current as HTMLSpanElement);

		React.useLayoutEffect(() => {
			const incoming = incomingRef.current;
			const layout = layoutRef.current;
			const outgoing = outgoingRef.current;
			const shouldReduceMotion =
				reducedMotion ||
				window.matchMedia("(prefers-reduced-motion: reduce)").matches;

			previousContent.current = { content, key: contentKey };

			if (!(incoming && layout)) {
				return;
			}

			if (changed && outgoing) {
				outgoing.hidden = false;
			}
			const preservedWidth = interruptedWidth.current;
			interruptedWidth.current = undefined;
			layout.style.width = "";
			const targetWidth = getTextWidth(incoming);
			const previousWidth =
				preservedWidth ??
				(changed && outgoing ? getTextWidth(outgoing) : targetWidth);
			layout.style.width = `${previousWidth}px`;

			if (!(changed && outgoing) || shouldReduceMotion) {
				if (outgoing) {
					outgoing.hidden = true;
				}
				layout.style.width = "";
				return;
			}

			const timing: KeyframeAnimationOptions = {
				duration: 400,
				easing: "cubic-bezier(0.22, 1, 0.36, 1)",
			};
			const incomingAnimation = incoming.animate(
				[
					{ opacity: 0, transform: "translateY(0.35em)" },
					{ opacity: 1, transform: "translateY(0)" },
				],
				timing,
			);
			const outgoingAnimation = outgoing.animate(
				[
					{ opacity: 1, transform: "translateY(0)" },
					{ opacity: 0, transform: "translateY(-0.35em)" },
				],
				timing,
			);
			const widthAnimation =
				Math.abs(targetWidth - previousWidth) > 0.5
					? layout.animate(
							[{ width: `${previousWidth}px` }, { width: `${targetWidth}px` }],
							timing,
						)
					: undefined;
			const animations = [
				incomingAnimation,
				outgoingAnimation,
				...(widthAnimation ? [widthAnimation] : []),
			];

			Promise.all(animations.map((animation) => animation.finished))
				.then(() => {
					outgoing.hidden = true;
					layout.style.width = "";
				})
				.catch(() => undefined);

			return () => {
				const wasInterrupted = animations.some(
					(animation) => animation.pending || animation.playState === "running",
				);
				const currentWidth = wasInterrupted
					? layout.getBoundingClientRect().width
					: undefined;
				interruptedWidth.current = currentWidth;
				for (const animation of animations) {
					animation.cancel();
				}
				outgoing.hidden = true;
				layout.style.width =
					currentWidth === undefined ? "" : `${currentWidth}px`;
			};
		}, [changed, content, contentKey, reducedMotion]);

		return (
			<span
				aria-atomic={ariaAtomic}
				aria-live={ariaLive}
				className={["inline-block align-baseline", className]
					.filter(Boolean)
					.join(" ")}
				data-key={String(contentKey)}
				data-slot="aeri-text-swap"
				ref={rootRef}
				role={role}
				style={style}
				{...props}
			>
				<span
					aria-hidden="true"
					className="inline-grid overflow-hidden align-baseline"
					data-slot="aeri-text-swap-layout"
					ref={layoutRef}
				>
					{changed ? (
						<span
							aria-hidden="true"
							className="col-start-1 row-start-1 w-max"
							data-slot="aeri-text-swap-outgoing"
							ref={outgoingRef}
						>
							{previousContent.current.content}
						</span>
					) : null}
					<span
						aria-hidden="true"
						className="col-start-1 row-start-1 w-max"
						data-slot="aeri-text-swap-content"
						ref={incomingRef}
					>
						{content}
					</span>
				</span>
				<span className="sr-only">{content}</span>
			</span>
		);
	},
);

export { TextSwap, type TextSwapProps };
