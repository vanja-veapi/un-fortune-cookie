import { indexPage } from './pages/indexPage.js';
import { openCookiePage } from './pages/openCookiePage.js';

const routes = {
	'/index.html': indexPage,
	'/open-cookie.html': openCookiePage,
};

// Since github pages return <url>/un-fortune-cookie/ instead of <url>/ we need to check if the pathname includes 3rd element
// /un-fortune-cookie/open-cookie.html
// ! localhost -> /open-cookie.html
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
