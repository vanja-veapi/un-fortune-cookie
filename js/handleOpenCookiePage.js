export const handleOpenCookiePage = () => {
	if (!window.location.hash) {
		alert('Treba da budes redirektovan');
		window.location.replace('/');
		return;
	}
	alert('USAO SI USPESNO NA STRANICI GDE OTVARAS KOLCACIC SUDBINE');
	// Sta se desi ako se kopira lose url?
};
