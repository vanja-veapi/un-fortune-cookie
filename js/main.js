import { indexPage } from './pages/indexPage.js';
import { openCookiePage } from './pages/openCookiePage.js';

const routes = {
	'/index.html': indexPage,
	'/open-cookie.html': openCookiePage,
};

function getRoutePath() {
	const pathname = window.location.pathname;
	const file = pathname.split('/').pop();

	return file ? `/${file}` : '/index.html';
}

function runRoute() {
	const path = getRoutePath();

	routes[path]();
}

runRoute();
