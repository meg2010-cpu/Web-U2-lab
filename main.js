let moneyStorageKey = 'coffeeClickerMoneyCents';
let startingMoneyCents = 1000;
let moneyCents = Number(localStorage.getItem(moneyStorageKey));
let timerStorageKey = 'coffeeClickerTimerEnd';
let shiftStartMoneyKey = 'coffeeClickerShiftStartMoneyCents';
let shiftPurchasesKey = 'coffeeClickerShiftPurchasesCents';
let shiftEarningsKey = 'coffeeClickerShiftEarningsCents';

let ownedIngredients = ["Coffee", "2% Milk", "Vanilla Syrup"];
let recipies = [
	{
		name: "Classic 2% Coffee",
		ingredients: ["Coffee", "2% Milk"],
		price: 5
	},
	{
		name: "Classic Oat Coffee",
		ingredients: ["Coffee", "Oat Milk"],
		price: 5
	},
	{
		name: "Classic Almond Coffee",
		ingredients: ["Coffee", "Almond Milk"],
		price: 5
	},
	{
		name: "Vanilla 2% Coffee",
		ingredients: ["Coffee", "2% Milk", "Vanilla Syrup"],
		price: 6
	},
	{
		name: "Chocolate Mocha",
		ingredients: ["Coffee", "2% Milk", "Chocolate"],
		price: 6
	},
	{
		name: "Vanilla Mocha",
		ingredients: ["Coffee", "2% Milk", "Vanilla Syrup", "Chocolate"],
		price: 7
	},
	{
		name: "Pumpkin Spice Coffee",
		ingredients: ["Coffee", "2% Milk", "Pumpkin Syrup", "Cinnamon"],
		price: 7
	},
	{
		name: "Oat Milk Vanilla Coffee",
		ingredients: ["Coffee", "Oat Milk", "Vanilla Syrup"],
		price: 6
	},
	{
		name: "Cinnamon Oat Coffee",
		ingredients: ["Coffee", "Oat Milk", "Cinnamon"],
		price: 6
	},
	{
		name: "Almond Vanilla Coffee",
		ingredients: ["Coffee", "Almond Milk", "Vanilla Syrup"],
		price: 6
	},
	{
		name: "Almond Chocolate Coffee",
		ingredients: ["Coffee", "Almond Milk", "Chocolate"],
		price: 6
	},
	{
		name: "Strawberry Almond Latte",
		ingredients: ["Coffee", "Almond Milk", "Strawberry"],
		price: 6
	},
	{
		name: "Strawberry Cream Coffee",
		ingredients: ["Coffee", "2% Milk", "Strawberry", "Whipped Cream"],
		price: 7
	},
	{
		name: "Rainbow Vanilla Latte",
		ingredients: ["Coffee", "2% Milk", "Vanilla Syrup", "Whipped Cream", "Rainbow Sprinkles"],
		price: 8
	},
	{
		name: "Cinnamon Cream Coffee",
		ingredients: ["Coffee", "2% Milk", "Cinnamon", "Whipped Cream"],
		price: 7
	},
	{
		name: "Chocolate Strawberry Coffee",
		ingredients: ["Coffee", "2% Milk", "Chocolate", "Strawberry", "Whipped Cream"],
		price: 8
	},
	{
		name: "Rainbow Chocolate Strawberry",
		ingredients: ["Coffee", "Almond Milk", "Chocolate", "Whipped Cream", "Strawberry", "Rainbow Sprinkles"],
		price: 10
	}
];

if (!Number.isInteger(moneyCents) || moneyCents < 0) {
	moneyCents = startingMoneyCents;
	localStorage.setItem(moneyStorageKey, String(moneyCents));
}
    
let moneyDisplay = document.getElementById('moneyAmount');
let shopMessage = document.getElementById('shopMessage');

let updateMoneyDisplay = () => {
	if (moneyDisplay) {
		moneyDisplay.textContent = `$${(moneyCents / 100).toFixed(2)}`;
	}
};
updateMoneyDisplay();

document.querySelectorAll('.buy-button').forEach((button) => {
	button.addEventListener('click', () => {
		const item = button.closest('.shop-item');
		const priceCents = Number(item.dataset.priceCents);
		if (moneyCents < priceCents) {
			if (shopMessage) {
				shopMessage.textContent = 'Not enough money for this item.';
			}
			return;
		}
		moneyCents -= priceCents;
		localStorage.setItem(moneyStorageKey, String(moneyCents));
		if (Number(localStorage.getItem(timerStorageKey)) > Date.now()) {
			let shiftPurchasesCents = Number(localStorage.getItem(shiftPurchasesKey)) || 0;
			localStorage.setItem(shiftPurchasesKey, String(shiftPurchasesCents + priceCents));
		}
		updateMoneyDisplay();
		if (shopMessage) {
			shopMessage.textContent = `Purchased ${item.dataset.item}!`;
		}
	});
});

window.addEventListener('storage', (event) => {
	if (event.key === moneyStorageKey && event.newValue !== null) {
		moneyCents = Number(event.newValue);
		updateMoneyDisplay();
	}
});

const playLink = document.querySelector('#playbutton-container a');

if (playLink) {
	playLink.addEventListener('click', () => {
		const newTimerEnd = Date.now() + 4 * 60 * 1000;
		localStorage.setItem(timerStorageKey, String(newTimerEnd));
		localStorage.setItem(shiftStartMoneyKey, String(Number(localStorage.getItem(moneyStorageKey)) || 0));
		localStorage.setItem(shiftPurchasesKey, '0');
		localStorage.removeItem(shiftEarningsKey);
	});
}

const timerDisplay = document.getElementById('timer');

if (timerDisplay) {
	let timerEnd = Number(localStorage.getItem(timerStorageKey));

	if (!Number.isFinite(timerEnd) || timerEnd <= 0) {
		timerEnd = Date.now() + 4 * 60 * 1000;
		localStorage.setItem(timerStorageKey, String(timerEnd));
		localStorage.setItem(shiftStartMoneyKey, String(moneyCents));
		localStorage.setItem(shiftPurchasesKey, '0');
		localStorage.removeItem(shiftEarningsKey);
	}

	const gameOverPopup = document.getElementById('gameOverPopup');
	const gameOverOverlay = document.getElementById('gameOverOverlay');
	const gameOverClose = document.getElementById('gameOverClose');
	const shiftEarningsDisplay = document.getElementById('shiftEarnings');
	let timerInterval;
	let gameOverShown = false;

	const showGameOver = () => {
		if (gameOverShown || !gameOverPopup || !gameOverOverlay) {
			return;
		}

		gameOverShown = true;
		let earnedCents = Number(localStorage.getItem(shiftEarningsKey));

		if (!Number.isInteger(earnedCents) || earnedCents < 0) {
			let startingBalance = Number(localStorage.getItem(shiftStartMoneyKey)) || 0;
			let shiftPurchasesCents = Number(localStorage.getItem(shiftPurchasesKey)) || 0;
			earnedCents = Math.max(0, moneyCents + shiftPurchasesCents - startingBalance);
			localStorage.setItem(shiftEarningsKey, String(earnedCents));
		}

		if (shiftEarningsDisplay) {
			shiftEarningsDisplay.textContent = `$${(earnedCents / 100).toFixed(2)}`;
		}

		gameOverPopup.hidden = false;
		gameOverOverlay.hidden = false;
	};

	const updateTimer = () => {
		const remainingSeconds = Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000));
		const minutes = Math.floor(remainingSeconds / 60);
		const seconds = String(remainingSeconds % 60).padStart(2, '0');

		timerDisplay.textContent = `${minutes}:${seconds}`;

		if (remainingSeconds === 0) {
			if (timerInterval) {
				clearInterval(timerInterval);
			}
			showGameOver();
		}
	};

	updateTimer();
	if (timerEnd > Date.now()) {
		timerInterval = setInterval(updateTimer, 250);
	}

	if (gameOverClose) {
		gameOverClose.addEventListener('click', () => {
			window.location.href = 'start.html';
		});
	}
}



