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