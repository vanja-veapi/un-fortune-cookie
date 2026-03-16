import { decodeUrlParam } from '../utils/decodeUrlParam.js';

const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const ONE_DAY_IN_MS =
	HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MS_PER_SECOND; // 86_400_000

const MQ_MEDIUM_BREAKPOINT = 768;

const COOKIE_X_START = 75;
const COOKIE_X_END = 374;
const COOKIE_Y_START = 95;
const COOKIE_Y_END = 286;

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

	if (window.innerWidth <= MQ_MEDIUM_BREAKPOINT) {
		const handleTouchStart = (ev) => {
			const hasTwoTouches = ev.touches.length === 2;
			const isTouchInRange = (touch) => {
				const { clientX: x, clientY: y } = touch;

				const isInXRange = x >= COOKIE_X_START && x <= COOKIE_X_END;
				const isInYRange = y >= COOKIE_Y_START && y <= COOKIE_Y_END;

				return isInXRange && isInYRange;
			};

			console.log({ touches: ev.touches });
			if (
				hasTwoTouches &&
				isTouchInRange(ev.touches[0]) &&
				isTouchInRange(ev.touches[1])
			) {
				openFortuneCookie();
			}
		};

		document.addEventListener('touchstart', handleTouchStart);

		return;
	}

	const keysPressed = {};
	const kbds = document.querySelectorAll('kbd');

	const handleKeyDown = (e) => {
		if (e.key.toLowerCase() === 'a') {
			kbds[0].classList.add('active');
		}
		if (e.key.toLowerCase() === 'd') {
			kbds[1].classList.add('active');
		}

		// If the user presses Shift + A + D, or CAPS LOCK is on and they press A + D, it should also work.
		keysPressed[e.key.toLowerCase()] = true;
		if (keysPressed['a'] && keysPressed['d']) {
			console.log('Both A and D are pressed together!');
			openFortuneCookie();
			// ✅ ugasi listener
			document.removeEventListener('keydown', handleKeyDown);
		}
	};
	document.addEventListener('keydown', handleKeyDown);

	document.addEventListener('keyup', (event) => {
		if (event.key.toLowerCase() === 'a') {
			kbds[0].classList.remove('active');
		}
		if (event.key.toLowerCase() === 'd') {
			kbds[1].classList.remove('active');
		}
		delete keysPressed[event.key.toLowerCase()];
	});
};

async function openFortuneCookie() {
	playSound();
	splitCookieAnimation(this);

	await new Promise((resolve) => requestAnimationFrame(resolve));

	renderMessageFromHash();
}

const playSound = () => {
	// TODO Dodaj sound
	// const audio = new Audio('../../audio/crunch.mp3');
};

const splitCookieAnimation = async () => {
	showBrokenCookieImages();

	await new Promise((resolve) => requestAnimationFrame(resolve));

	removeControlsContainer();

	await new Promise((resolve) => requestAnimationFrame(resolve));

	breakCookieAnimation();
};

const showBrokenCookieImages = () => {
	const brokenCookie = document.querySelectorAll('.cookie-piece');
	brokenCookie.forEach((img) => {
		img.classList.remove('d-none');
	});
};

const removeControlsContainer = () => {
	const controlContainer = document.querySelectorAll('.controls-container');
	controlContainer.forEach((container) => {
		container.classList.replace('flex-center', 'd-none');
	});
};
const breakCookieAnimation = () => {
	const cookieParts = document.querySelectorAll('.cookie-piece');
	cookieParts.forEach((part, i) =>
		part.classList.add(i === 0 ? 'slide-left' : 'slide-right'),
	);
};

const renderMessageFromHash = () => {
	const { sentAt_timestamp, message, signature } = getHashParams();

	renderMessagePaper({ message, signature, date: new Date(sentAt_timestamp) });
	removeOpacityFromMessagePaper();
};

const removeOpacityFromMessagePaper = async () => {
	await new Promise((resolve) => requestAnimationFrame(resolve));

	const messagePaper = document.querySelector('main');
	messagePaper.classList.remove('opacity-0');
};
const renderMessagePaper = ({ message, signature, date }) => {
	const messageContainer = createDOMElement('main');
	messageContainer.classList.add('absolute', 'transition', 'opacity-0');

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
