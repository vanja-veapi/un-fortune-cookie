import { decodeUrlParam } from './utils/decodeUrlParam.js';

const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

const ONE_DAY_IN_MS =
	HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MS_PER_SECOND; // 86_400_000

export const handleOpenCookiePage = () => {
	if (!window.location.hash) {
		alert('Treba da budes redirektovan');
		window.location.replace('/');
		return;
	}

	const now = Date.now();
	const { timestamp: dateTheMessageWasSent } = getHashParams();

	if (now - dateTheMessageWasSent > ONE_DAY_IN_MS) {
		alert('Isteklo je vreme za pregled poruke');
		window.location.replace('/');
		return;
	}

	const btnOpenCookie = document.querySelector('#btn-open-cookie');

	btnOpenCookie.addEventListener('click', renderMessageFromHash);
};

const renderMessageFromHash = () => {
	const { timestamp, message, signature } = getHashParams();

	renderMessagePaper({ message, signature, date: new Date(timestamp) });
};

const renderMessagePaper = ({ message, signature, date }) => {
	const containerId = 'message-container';
	if (document.querySelector(`#${containerId}`)) return;

	const container = createDOMElement('main', {
		style: {
			fontSize: '24px',
			marginTop: '20px',
			border: '2px solid red',
		},
		id: containerId,
	});

	container.appendChild(createDOMElement('p', { content: message }));
	container.appendChild(createDOMElement('p', { content: `Datum: ${date}` }));

	if (signature) {
		container.appendChild(
			createDOMElement('p', { content: `Potpis: ${signature}` }),
		);
	}

	document.body.appendChild(container);
};

const createDOMElement = (tagName, options = {}) => {
	const { content, style, id } = options;

	const element = document.createElement(tagName);

	if (id) element.id = id;
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
		timestamp: Number(decoded.get('date')),
	};
};
