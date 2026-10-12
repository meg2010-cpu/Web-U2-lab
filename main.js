<<<<<<< HEAD
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
=======
// instructions page popup
let instructionsBtn = document.querySelector('#instructionsBtn');
let closeBtn = document.querySelector('#closeBtn');
let popup = document.querySelector('#popup');
let overlay = document.querySelector('#overlay');

instructionsBtn.addEventListener('click', () => {
popup.classList.add('active');
overlay.classList.add('active');
});

closeBtn.addEventListener('click', () => {
popup.classList.remove('active');
overlay.classList.remove('active');
});

overlay.addEventListener('click', () => {
popup.classList.remove('active');
overlay.classList.remove('active');
});
>>>>>>> f0856f83792a7c629bcfdfbb564d9d28958ec654
