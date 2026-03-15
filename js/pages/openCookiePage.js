import { decodeUrlParam } from '../utils/decodeUrlParam.js';

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

	btnOpenCookie.addEventListener('click', renderMessageFromHash, {
		once: true,
	});
};

const renderMessageFromHash = () => {
	const { sentAt_timestamp, message, signature } = getHashParams();

	renderMessagePaper({ message, signature, date: new Date(sentAt_timestamp) });
};

const renderMessagePaper = ({ message, signature, date }) => {
	const container = createDOMElement('main', {
		style: {
			fontSize: '24px',
			marginTop: '20px',
			border: '2px solid red',
		},
	});

	container.appendChild(createDOMElement('p', { content: message }));
	container.appendChild(
		createDOMElement('p', { content: `Datum: ${date.toLocaleString()}` }),
	);

	if (signature) {
		container.appendChild(
			createDOMElement('p', { content: `Potpis: ${signature}` }),
		);
	}

	document.body.appendChild(container);
};

const createDOMElement = (tagName, options = {}) => {
	const { content, style } = options;

	const element = document.createElement(tagName);

	if (content) element.textContent = content;

	if (style) {
		for (const key in style) {
			element.style[key] = style[key];
		}
	}

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
