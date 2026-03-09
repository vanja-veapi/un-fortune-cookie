export const decodeUrlParam = (encoded) => {
	const binary = atob(decodeURIComponent(encoded));
	const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));

	return new TextDecoder().decode(bytes);
};
