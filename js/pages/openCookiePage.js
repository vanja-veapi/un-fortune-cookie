import { decodeUrlParam } from '../utils/decodeUrlParam.js';
import { sleep } from '../utils/sleep.js';

const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

const ONE_DAY_IN_MS =
	HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MS_PER_SECOND; // 86_400_000

const redirectHome = (message) => {
	alert(message);
	window.location.replace('/');
};

export const openCookiePage = () => {
	if (!window.location.hash) {
		redirectHome('Treba da budes redirektovan');
		return;
	}

	const now = Date.now();
	const { sentAt_timestamp } = getHashParams();

	if (now - sentAt_timestamp > ONE_DAY_IN_MS) {
		redirectHome('Isteklo je vreme za pregled poruke');
		return;
	}

	const btnOpenCookie = document.querySelector('#btn-open-cookie');
	btnOpenCookie.addEventListener(
		'click',
		async function () {
			splitCookieAnimation(this);

			await sleep(700);

			renderMessageFromHash();
		},
		{
			once: true,
		},
	);
};

const splitCookieAnimation = async () => {
	const brokenCookieContainer = createBrokenCookieContainer();
	insertBrokenCookieImages(brokenCookieContainer);

	breakCookieAnimation();
};

const createBrokenCookieContainer = () => {
	const cookieContainer = createDOMElement('div');
	cookieContainer.classList.add('flex-center');
	return cookieContainer;
};

const insertBrokenCookieImages = (brokenCookieContainer) => {
	const parentContainer = document.querySelector('.container');
	brokenCookieContainer.innerHTML = `
		<img src="../../img/whole-cookie-split-left.png" alt="Kolacic srece" width="480" class="cookie-fortune absolute transition" />
		<img src="../../img/whole-cookie-split-right.png" alt="Kolacic srece" width="480" class="cookie-fortune absolute transition" />`;

	parentContainer.replaceChildren(brokenCookieContainer);
};

const breakCookieAnimation = async () => {
	await sleep(500);
	const cookieParts = document.querySelectorAll('.cookie-fortune');
	cookieParts.forEach((part, i) =>
		part.classList.add(i === 0 ? 'slide-left' : 'slide-right'),
	);
};

const renderMessageFromHash = () => {
	const { sentAt_timestamp, message, signature } = getHashParams();

	renderMessagePaper({ message, signature, date: new Date(sentAt_timestamp) });
};

const renderMessagePaper = ({ message, signature, date }) => {
	const messageContainer = createDOMElement('main');
	messageContainer.classList.add('absolute');

	messageContainer.appendChild(createDOMElement('p', { content: message }));
	messageContainer.appendChild(
		createDOMElement('p', { content: `Datum: ${date.toLocaleString()}` }),
	);

	if (signature) {
		messageContainer.appendChild(
			createDOMElement('p', { content: `Potpis: ${signature}` }),
		);
	}

	const cookieContainer = document.querySelector('.container');
	cookieContainer.appendChild(messageContainer);
};

const createDOMElement = (tagName, options = {}) => {
	const { content } = options;

	const element = document.createElement(tagName);

	if (content) element.textContent = content;

	// if (style) {
	// 	for (const key in style) {
	// 		element.style[key] = style[key];
	// 	}
	// }

	return element;
};

const getHashParams = () => {
	const decoded = decodeUrlParam(window.location.hash.slice(1)); // slice(1) uklanja #
	return {
		message: decoded.get('message'),
		signature: decoded.get('signature'),
		sentAt_timestamp: Number(decoded.get('date')),
	};
};
