import { indexPage } from './pages/indexPage.js';
import { openCookiePage } from './pages/openCookiePage.js';

const routes = {
	'/index.html': indexPage,
	'/open-cookie.html': openCookiePage,
};

function runRoute() {
	const path =
		window.location.pathname === '/' ? '/index.html' : window.location.pathname;

	routes[path]();
}

runRoute();
