export const decodeUrlParam = (encoded) => {
	const binary = atob(decodeURIComponent(encoded));
	const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));

	const decodedHash = new TextDecoder().decode(bytes);
	return new URLSearchParams(decodedHash);
};
