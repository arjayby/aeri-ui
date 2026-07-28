"use client";

import * as React from "react";

type NumberTickerProps = Omit<
	React.ComponentPropsWithRef<"span">,
	"children"
> & {
	formatOptions?: Intl.NumberFormatOptions;
	locales?: Intl.LocalesArgument;
	reducedMotion?: boolean;
	value: number;
};

function getTextWidth(element: HTMLElement) {
	const range = document.createRange();
	range.selectNodeContents(element);
	return range.getBoundingClientRect().width;
}

const NumberTicker = React.forwardRef<HTMLSpanElement, NumberTickerProps>(
	function NumberTicker(
		{
			"aria-atomic": ariaAtomic = true,
			"aria-live": ariaLive = "polite",
			className,
			formatOptions,
			locales,
			reducedMotion = false,
			role = "status",
			style,
			value,
			...props
		},
		ref,
	) {
		const formattedValue = React.useMemo(() => {
			if (!Number.isFinite(value)) {
				throw new RangeError("NumberTicker value must be finite.");
			}

			return new Intl.NumberFormat(locales, formatOptions).format(value);
		}, [formatOptions, locales, value]);
		const previousValue = React.useRef({
			formatted: formattedValue,
			value,
		});
		const incomingRef = React.useRef<HTMLSpanElement>(null);
		const interruptedWidth = React.useRef<number | undefined>(undefined);
		const layoutRef = React.useRef<HTMLSpanElement>(null);
		const outgoingRef = React.useRef<HTMLSpanElement>(null);
		const rootRef = React.useRef<HTMLSpanElement>(null);
		const changed = previousValue.current.formatted !== formattedValue;
		const direction =
			value === previousValue.current.value
				? "none"
				: value > previousValue.current.value
					? "up"
					: "down";

		React.useImperativeHandle(ref, () => rootRef.current as HTMLSpanElement);

		React.useLayoutEffect(() => {
			const incoming = incomingRef.current;
			const layout = layoutRef.current;
			const outgoing = outgoingRef.current;
			const shouldReduceMotion =
				reducedMotion ||
				window.matchMedia("(prefers-reduced-motion: reduce)").matches;

			previousValue.current = { formatted: formattedValue, value };

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

			const offset = direction === "down" ? "-0.7em" : "0.7em";
			const outgoingOffset = direction === "down" ? "0.7em" : "-0.7em";
			const timing: KeyframeAnimationOptions = {
				duration: 400,
				easing: "cubic-bezier(0.22, 1, 0.36, 1)",
			};
			const outgoingAnimation = outgoing.animate(
				[
					{ opacity: 1, transform: "translateY(0)" },
					{ opacity: 0, transform: `translateY(${outgoingOffset})` },
				],
				timing,
			);
			const incomingAnimation = incoming.animate(
				[
					{ opacity: 0, transform: `translateY(${offset})` },
					{ opacity: 1, transform: "translateY(0)" },
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
		}, [changed, direction, formattedValue, reducedMotion, value]);

		return (
			<span
				aria-atomic={ariaAtomic}
				aria-live={ariaLive}
				className={["inline-block align-baseline", className]
					.filter(Boolean)
					.join(" ")}
				data-direction={direction}
				data-slot="aeri-number-ticker"
				data-value={String(value)}
				ref={rootRef}
				role={role}
				style={style}
				{...props}
			>
				<span
					aria-hidden="true"
					className="inline-grid justify-items-end overflow-hidden align-baseline tabular-nums"
					data-slot="aeri-number-ticker-layout"
					ref={layoutRef}
				>
					{changed ? (
						<span
							aria-hidden="true"
							className="col-start-1 row-start-1 w-max opacity-0 will-change-[transform,opacity]"
							data-slot="aeri-number-ticker-outgoing"
							ref={outgoingRef}
						>
							{previousValue.current.formatted}
						</span>
					) : null}
					<span
						aria-hidden="true"
						className="col-start-1 row-start-1 w-max will-change-[transform,opacity]"
						data-slot="aeri-number-ticker-value"
						ref={incomingRef}
					>
						{formattedValue}
					</span>
				</span>
				<span className="sr-only">{formattedValue}</span>
			</span>
		);
	},
);

export { NumberTicker, type NumberTickerProps };
