import { useEffect, useState } from "react";

/**
 * Hook to observe whether an element is visible in the viewport
 * 
 * @param ref Ref to the element to observe
 * @returns state of whether the element is visible in the viewport
 */
export function useIsVisible(ref) {
	const [isIntersecting, setIntersecting] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			setIntersecting(entry.isIntersecting)
		}
		);

		observer.observe(ref.current);
		return () => {
			observer.disconnect();
		};
	}, [ref]);

	return isIntersecting;
}