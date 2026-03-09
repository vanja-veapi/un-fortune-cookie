/**
 * With TextEncoder encode approach, we can use letters such as č, ž or emojis, without that we will get an error InvalidCharacterError
 */
export const encodeUrlParam = (str) => {
	const bytes = new TextEncoder().encode(str);
	return encodeURIComponent(btoa(String.fromCharCode(...bytes)));
};
