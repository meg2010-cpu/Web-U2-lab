let moneyKey = 'money';
let ownedKey = 'owned';
let timerKey = 'timerEnd';
let earnedKey = 'earned';
let madeKey = 'made';

function load(key, backup) {
	let value = localStorage.getItem(key);
	if (value === null) {
		return backup;
	}
	try {
		return JSON.parse(value);
	} catch {
		return backup;
	}
}

function save(key, value) {
	localStorage.setItem(key, JSON.stringify(value));
}

function formatMoney(cents) {
	return '$' + (cents / 100).toFixed(2);
}

let starters = ['machine', '2percent', 'vanilla'];
let shiftLength = 4 * 60 * 1000;

let money = load(moneyKey, 0);
if (!Number.isInteger(money) || money < 0) {
	money = 0;
}

let owned = load(ownedKey, []);
if (!Array.isArray(owned)) {
	owned = [];
}
for (let item of starters) {
	if (!owned.includes(item)) {
		owned.push(item);
	}
}
save(ownedKey, owned);

let made = load(madeKey, 0);

let recipes = [
	{
		name: 'Classic 2% Coffee', 
		ingredients: ['Coffee', '2% Milk'], 
		price: 5 },
	{ 
		name: 'Classic Oat Coffee', 
		ingredients: ['Coffee', 'Oat Milk'], 
		price: 5 },
	{ 
		name: 'Classic Almond Coffee', 
		ingredients: ['Coffee', 'Almond Milk'], 
		price: 5 },
	{ 
		name: 'Vanilla 2% Coffee', 
		ingredients: ['Coffee', '2% Milk', 'Vanilla Syrup'], 
		price: 6 },
	{ 
		name: 'Chocolate Mocha', 
		ingredients: ['Coffee', '2% Milk', 'Chocolate'], 
		price: 6 },
	{ 
		name: 'Vanilla Mocha', 
		ingredients: ['Coffee', '2% Milk', 'Vanilla Syrup', 'Chocolate'], 
		price: 7 },
	{ 
		name: 'Pumpkin Spice Coffee', 
		ingredients: ['Coffee', '2% Milk', 'Pumpkin Syrup', 'Cinnamon'], 
		price: 7 },
	{ 
		name: 'Oat Milk Vanilla Coffee', 
		ingredients: ['Coffee', 'Oat Milk', 'Vanilla Syrup'], 
		price: 6 },
	{ 
		name: 'Cinnamon Oat Coffee', 
		ingredients: ['Coffee', 'Oat Milk', 'Cinnamon'], 
		price: 6 },
	{ 
		name: 'Almond Vanilla Coffee', 
		ingredients: ['Coffee', 'Almond Milk', 'Vanilla Syrup'], 
		price: 6 },
	{ 
		name: 'Almond Chocolate Coffee', 
		ingredients: ['Coffee', 'Almond Milk', 'Chocolate'], 
		price: 6 },
	{ 
		name: 'Strawberry Almond Latte', 
		ingredients: ['Coffee', 'Almond Milk', 'Strawberry'], 
		price: 6 },
	{ 
		name: 'Strawberry Cream Coffee', 
		ingredients: ['Coffee', '2% Milk', 'Strawberry', 'Whipped Cream'], 
		price: 7 },
	{ 
		name: 'Rainbow Vanilla Latte', 
		ingredients: ['Coffee', '2% Milk', 'Vanilla Syrup', 'Whipped Cream', 'Rainbow Sprinkles'], 
		price: 8 },
	{ 
		name: 'Cinnamon Cream Coffee', 
		ingredients: ['Coffee', '2% Milk', 'Cinnamon', 'Whipped Cream'], 
		price: 7 },
	{ 
		name: 'Chocolate Strawberry Coffee', 
		ingredients: ['Coffee', '2% Milk', 'Chocolate', 'Strawberry', 'Whipped Cream'], 
		price: 8 },
	{ 
		name: 'Rainbow Chocolate Strawberry', 
		ingredients: ['Coffee', 'Almond Milk', 'Chocolate', 'Whipped Cream', 'Strawberry', 'Rainbow Sprinkles'], 
		price: 10 }
];

let names = {
	machine: 'Coffee',
	'2percent': '2% Milk',
	oat: 'Oat Milk',
	almond: 'Almond Milk',
	chocolate: 'Chocolate',
	choco: 'Chocolate',
	strawberry: 'Strawberry',
	pumpkin: 'Pumpkin Syrup',
	vanilla: 'Vanilla Syrup',
	rainbow: 'Rainbow Sprinkles',
	sprinkles: 'Rainbow Sprinkles',
	cinnamon: 'Cinnamon',
	cream: 'Whipped Cream',
	frappe: 'Frappe',
	latte: 'Latte'
};

let recipeList = document.querySelector('#recipe-items');
let sendButton = document.querySelector('#sendbutton');
let moneyText = document.querySelector('#moneyAmount');
let shopMessage = document.querySelector('#shopMessage');
let playbutton = document.querySelector('#playbutton-container a');
let timerText = document.querySelector('#timer');

function showMoney() {
	if (moneyText) {
		moneyText.textContent = formatMoney(money);
	}
}
showMoney();

let recipe = null;
let added = [];

function newRecipe() {
	let have = owned.map(item => names[item]);
	let options = recipes.filter(r => r.ingredients.every(i => have.includes(i)));

	if (options.length === 0) {
		recipe = null;
		recipeList.innerHTML = '<li>Buy more ingredients!</li>';
		return;
	}

	recipe = options[Math.floor(Math.random() * options.length)];
	added = [];
	document.querySelector('#recipe-name').textContent = recipe.name;

	recipeList.innerHTML = '';
	for (let ingredient of recipe.ingredients) {
		let li = document.createElement('li');
		li.textContent = ingredient;
		recipeList.appendChild(li);
	}
}

document.querySelectorAll('.ingredient-button').forEach(button => {
	button.classList.remove('selected');
	if (owned.includes(button.dataset.ingredient)) {
		button.classList.add('unlocked');
	} else {
		button.classList.remove('unlocked');
	}

	button.addEventListener('click', () => {
		if (!recipe || !button.classList.contains('unlocked')) {
			return;
		}

		let ingredient = names[button.dataset.ingredient];
		let index = recipe.ingredients.indexOf(ingredient);
		if (index === -1 || added.includes(ingredient)) {
			return;
		}
		added.push(ingredient);
		recipeList.children[index].style.color = 'green';
	});
});

if (sendButton) {
	sendButton.addEventListener('click', () => {
		if (!recipe || added.length !== recipe.ingredients.length) {
			return;
		}

		let earned = recipe.price * 100;
		money += earned;
		made++;

		save(moneyKey, money);
		save(earnedKey, load(earnedKey, 0) + earned);
		save(madeKey, made);

		showMoney();
		newRecipe();
	});
}

if (recipeList) {
	newRecipe();
}

function shopmessage(text, success) {
	if (!shopMessage) {
		return;
	}
	shopMessage.textContent = text;
	if (success) {
		shopMessage.classList.add('shop-message-success');
		shopMessage.classList.remove('shop-message-error');
	} else {
		shopMessage.classList.add('shop-message-error');
		shopMessage.classList.remove('shop-message-success');
	}
}

document.querySelectorAll('.buy-button').forEach(button => {
	button.addEventListener('click', () => {
		let shopItem = button.closest('.shop-item');
		let item = shopItem.dataset.item;
		let price = Number(shopItem.dataset.priceCents);

		if (owned.includes(item)) {
			shopmessage('You already own this item.', false);
			return;
		}
		if (money < price) {
			shopmessage('Not enough money. Come back after making more drinks!', false);
			return;
		}
		money -= price;
		owned.push(item);
		save(moneyKey, money);
		save(ownedKey, owned);
		showMoney();
		shopmessage('You bought ' + (names[item] || item) + '!', true);
	});
});

window.addEventListener('storage', (e) => {
	if (e.key === moneyKey && e.newValue !== null) {
		money = Number(e.newValue);
		showMoney();
	}
});

if (playbutton) {
	playbutton.addEventListener('click', () => {
		money = 0;
		owned = starters.slice();
		made = 0;

		save(moneyKey, money);
		save(ownedKey, owned);
		save(madeKey, made);
		save(timerKey, Date.now() + shiftLength);
		localStorage.removeItem(earnedKey);
	});
}

function gameOver() {
	let popup = document.querySelector('#gameOverPopup');
	let overlay = document.querySelector('#gameOverOverlay');
	if (!popup || !overlay) {
		return;
	}

	let madeText = document.querySelector('#recipesCompleted');
	let earnedText = document.querySelector('#shiftEarnings');
	if (madeText) {
		madeText.textContent = made;
	}
	if (earnedText) {
		earnedText.textContent = formatMoney(load(earnedKey, 0));
	}

	popup.hidden = false;
	overlay.hidden = false;
}

if (timerText) {
	let end = load(timerKey, 0);
	if (!end) {
		end = Date.now() + shiftLength;
		save(timerKey, end);
		localStorage.removeItem(earnedKey);
	}

	let timer;

	function passtime() {
		let secs = Math.max(0, Math.ceil((end - Date.now()) / 1000));
		let mins = Math.floor(secs / 60);
		let rest = secs % 60;
		if (rest < 10) {
			rest = '0' + rest;
		}
		timerText.textContent = mins + ':' + rest;

		if (secs === 0) {
			clearInterval(timer);
			gameOver();
		}
	}

	timer = setInterval(passtime, 250);
	passtime();

	let closeButton = document.querySelector('#gameOverClose');
	if (closeButton) {
		closeButton.addEventListener('click', () => {
			window.location.href = 'start.html';
		});
	}
}