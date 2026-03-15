import { encodeUrlParam } from './utils/encodeUrlParam.js';

import fortuneCookie from '../data/fortune-cookie.json' with { type: 'json' };
import { decodeUrlParam } from './utils/decodeUrlParam.js';

const STATE = {
	checkedCookie: null,
};

export const handleIndexPage = () => {
	const fortuneCookies = document.querySelectorAll(
		'input[name="fortune-cookie"]',
	);

	const updateCheckedCookie = (ev) => (STATE.checkedCookie = ev.target.value);
	fortuneCookies.forEach((cookie) => {
		if (cookie.checked) {
			STATE.checkedCookie = cookie.value;
		}
		cookie.addEventListener('change', updateCheckedCookie);
	});

	/**
	 * Kada posaljemo kolacic (ne)Srece saljemo
	 * 1. Poruku
	 * 2. Potpis
	 * 3. Vreme koliko vazi ta poruka prema vremenskoj zoni u kojoj je poruka prvi put otvorena
	 */

	const createCookieButton = document.getElementById('create-cookie-btn');

	createCookieButton.addEventListener('click', handleCreateCookie);
};

const getFortuneCookieMessage = () => {
	const randomIndex = Math.floor(Math.random() * fortuneCookie.messages.length);

	return fortuneCookie.messages[randomIndex];
};

const getMisfortuneCookieMessage = () => {
	console.log('Under construction');
};

const validateForm = () => {
	if (!STATE.checkedCookie)
		throw new Error('Ovo polje je obavezno i mora da bude cekirano');
};

const buildEncodedUrl = (cookieData) => {
	const OPEN_COOKIE_HTML_PATHNAME = '/open-cookie.html';
	const queryString = new URLSearchParams(cookieData).toString();

	const encodeQueryString = encodeUrlParam(queryString);

	const url = new URL(OPEN_COOKIE_HTML_PATHNAME, window.location.origin);
	url.hash = encodeQueryString;

	return url;
};

const renderMessageSuccess = (encodedUrl) => {
	const span = document.querySelector('span');

	span.innerHTML = `Napravio si url, evo ti link do njega: <a href="${encodedUrl}">${encodedUrl}</a>`;
	span.classList.remove('d-none');
};

const buildCookieData = () => {
	const signature = document.querySelector('#signature');
	const signatureValue = signature.value.trim();

	return {
		message: STATE.checkedCookie
			? getFortuneCookieMessage()
			: getMisfortuneCookieMessage(),
		signature: signatureValue,
		date: Date.now(),
	};
};

const handleCreateCookie = () => {
	validateForm();

	const cookieData = buildCookieData();
	const encodedUrl = buildEncodedUrl(cookieData);

	renderMessageSuccess(encodedUrl);

	// !OVO JE ZA DEKODIRANJE nije deo koda koji ce ostati ovde
	const decoded = decodeUrlParam(encodedUrl.hash.slice(1));
	const params = new URLSearchParams(decoded);
	console.log({ decoded, params, message: params.get('message') });
};
