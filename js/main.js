// TODO Verovatno je bolji nazivm samo naziv stranice bez handle
import { handleIndexPage } from './handleIndexPage.js';
import { handleOpenCookiePage } from './handleOpenCookiePage.js';

const routes = {
	'/index.html': handleIndexPage,
	'/open-cookie.html': handleOpenCookiePage,
};

function runRoute() {
	const path =
		window.location.pathname === '/' ? '/index.html' : window.location.pathname;

	routes[path]();
}

runRoute();
