import { HTMLAttributes } from "react";

export type TypographyProps = HTMLAttributes<HTMLElement>;

export function Title({ children, className, ...rest }: TypographyProps) {
	return (
		<h1
			className={`scroll-m-20 text-4xl font-bold lg:text-5xl ${className}`}
			{...rest}
		>
			{children}
		</h1>
	);
}

export function TypographyH1({
	children,
	className,
	...rest
}: TypographyProps) {
	return (
		<h2
			className={`scroll-m-20 text-md font-bold lg:text-xl ${className}`}
			{...rest}
		>
			{children}
		</h2>
	);
}

export function TypographyH2({
	children,
	className,
	...rest
}: TypographyProps) {
	return (
		<h3
			className={`scroll-m-20 border-b pb-2 text-3xl font-semibold transition-colors first:mt-0 ${className}`}
			{...rest}
		>
			{children}
		</h3>
	);
}

export function TypographyH3({
	children,
	className,
	...rest
}: TypographyProps) {
	return (
		<h4
			className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`}
			{...rest}
		>
			{children}
		</h4>
	);
}

export function TypographyLead({
	className,
	children,
	...rest
}: TypographyProps) {
	return (
		<p className={`text-xl text-muted-foreground ${className}`} {...rest}>
			{children}
		</p>
	);
}

export function TypographyLarge({
	children,
	className,
	...rest
}: TypographyProps) {
	return (
		<div className={`text-lg font-semibold ${className}`} {...rest}>
			{children}
		</div>
	);
}

export function TypographySmall({
	children,
	className,
	...rest
}: TypographyProps) {
	return (
		<small
			className={`text-sm font-medium leading-none ${className}`}
			{...rest}
		>
			{children}
		</small>
	);
}

export function TypographyP({ children, className, ...rest }: TypographyProps) {
	return (
		<p className={`leading-7 ${className}`} {...rest}>
			{children}
		</p>
	);
}
