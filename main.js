//instructions page popup
const instructionsBtn = document.getElementById('instructionsBtn');
const closeBtn = document.getElementById('closeBtn');
const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');

instructionsBtn.addEventListener('click', () => {
    popup.classList.add('active');
    overlay.classList.add('active');
});

closeBtn.addEventListener('click', () => {
    popup.classList.remove('active');
    overlay.classList.remove('active');
});