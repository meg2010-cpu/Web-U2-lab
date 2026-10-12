const openButton = document.getElementById('openBtn');
const closeButton = document.getElementById('closeBtn');
const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');

if (openButton && closeButton && popup && overlay) {
	const closePopup = () => {
		popup.hidden = true;
		overlay.hidden = true;
		openButton.focus();
	};

	openButton.addEventListener('click', () => {
		popup.hidden = false;
		overlay.hidden = false;
		closeButton.focus();
	});

	closeButton.addEventListener('click', closePopup);
	overlay.addEventListener('click', closePopup);

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && !popup.hidden) {
			closePopup();
		}
	});
}
