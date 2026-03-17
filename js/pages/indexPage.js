import { encodeUrlParam } from '../utils/encodeUrlParam.js';

import fortuneCookie from '../../data/fortune-cookie.json' with { type: 'json' };
import misfortuneCookie from '../../data/misfortune-cookie.json' with { type: 'json' };

const STATE = {
	checkedCookie: null,
};

export const indexPage = () => {
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

const getRandomIndex = (array) => Math.floor(Math.random() * array.length);

const getCookieMessage = (checked) => {
	const isFortuneCookie = checked === 'fortune';

	const messages = isFortuneCookie
		? fortuneCookie.messages
		: misfortuneCookie.messages;

	const randomIndex = getRandomIndex(messages);

	return messages[randomIndex];
};

const isFieldChecked = () =>
	STATE.checkedCookie === 'fortune' || STATE.checkedCookie === 'misfortune';

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
		message: getCookieMessage(STATE.checkedCookie),
		signature: signatureValue,
		date: Date.now(),
	};
};

const handleCreateCookie = () => {
	if (!isFieldChecked()) return;

	const cookieData = buildCookieData();
	const encodedUrl = buildEncodedUrl(cookieData);

	renderMessageSuccess(encodedUrl);
};
