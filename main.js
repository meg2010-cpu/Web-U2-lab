const moneyStorageKey = 'coffeeClickerMoneyCents';
const startingMoneyCents = 1000;
let moneyCents = Number(localStorage.getItem(moneyStorageKey));

if (!Number.isInteger(moneyCents) || moneyCents < 0) {
	moneyCents = startingMoneyCents;
	localStorage.setItem(moneyStorageKey, String(moneyCents));
}

const moneyDisplay = document.getElementById('moneyAmount');
const shopMessage = document.getElementById('shopMessage');

const updateMoneyDisplay = () => {
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
