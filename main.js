let moneyStorageKey = 'coffeeClickerMoneyCents';
let startingMoneyCents = 1000;
let moneyCents = Number(localStorage.getItem(moneyStorageKey));

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
        name: "classic almond coffee",
        ingredients: ["Coffee", "Almond Milk"],
        price: 5
    },
	{
		name: "Vanilla 2% Coffee",
		ingredients: ["Coffee", "2% Milk", "Vanilla Syrup"],
		price: 6
	},
	{
		name: "Cinnamon Vanilla Coffee",
		ingredients: ["Coffee", "2% Milk", "Vanilla Syrup", "Cinnamon"],
		price: 7
	},
	{
		name: "Chocolate Mocha",
		ingredients: ["Coffee", "2% Milk", "Chocolate Syrup"],
		price: 6
	},
	{
		name: "Vanilla Mocha",
		ingredients: ["Coffee", "2% Milk", "Vanilla Syrup", "Chocolate Syrup"],
		price: 7
	},
	{
		name: "Pumpkin Spice Coffee",
		ingredients: ["Coffee", "2% Milk", "Pumpkin Syrup", "Cinnamon"],
		price: 7
	},
	{
		name: "Pumpkin Vanilla Coffee",
		ingredients: ["Coffee", "2% Milk", "Pumpkin Syrup", "Vanilla Syrup"],
		price: 7
	},
	{
		name: "Oat Milk Vanilla Coffee",
		ingredients: ["Coffee", "Oat Milk", "Vanilla Syrup"],
		price: 6
	},
	{
		name: "Oat Milk Mocha",
		ingredients: ["Coffee", "Oat Milk", "Chocolate Syrup"],
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
		ingredients: ["Coffee", "Almond Milk", "Chocolate Syrup"],
		price: 6
	},
	{
		name: "Strawberry Almond Latte",
		ingredients: ["Coffee", "Almond Milk", "Strawberry Syrup"],
		price: 6
	},
	{
		name: "Strawberry Cream Coffee",
		ingredients: ["Coffee", "2% Milk", "Strawberry Syrup", "Whipped Cream"],
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
		name: "Chocolate Drizzle Coffee",
		ingredients: ["Coffee", "2% Milk", "Chocolate Syrup", "Caramel Drizzle", "Whipped Cream"],
		price: 8
	},
	{
		name: "Pumpkin Oat Cream Coffee",
		ingredients: ["Coffee", "Oat Milk", "Pumpkin Syrup", "Whipped Cream"],
		price: 7
	},
	{
		name: "Strawberry Vanilla Oat Latte",
		ingredients: ["Coffee", "Oat Milk", "Strawberry Syrup", "Vanilla Syrup", "Caramel Drizzle"],
		price: 8
	},
	{
		name: "Rainbow Mocha Supreme",
		ingredients: ["Coffee", "Almond Milk", "Chocolate Syrup", "Whipped Cream", "Caramel Drizzle", "Rainbow Sprinkles"],
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



