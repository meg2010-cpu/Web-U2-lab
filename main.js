let moneyStorageKey = 'coffeeClickerMoneyCents';
let startingMoneyCents = 0;
let moneyCents = Number(localStorage.getItem(moneyStorageKey));
let moneyTestSeedKey = 'coffeeClickerZeroDollarTestSeeded';
let ingredientStorageKey = 'coffeeClickerOwnedIngredients';
let selectedIngredientStorageKey = 'coffeeClickerSelectedIngredients';
let starterIngredients = ['machine', '2percent', 'vanilla'];
let timerStorageKey = 'coffeeClickerTimerEnd';
let shiftStartMoneyKey = 'coffeeClickerShiftStartMoneyCents';
let shiftPurchasesKey = 'coffeeClickerShiftPurchasesCents';
let shiftEarningsKey = 'coffeeClickerShiftEarningsCents';

let ownedIngredients;

try {
	let savedIngredients = JSON.parse(localStorage.getItem(ingredientStorageKey));
	ownedIngredients = Array.isArray(savedIngredients) ? savedIngredients : [...starterIngredients];
} catch {
	ownedIngredients = [...starterIngredients];
}

ownedIngredients = [...new Set([...starterIngredients, ...ownedIngredients])];
localStorage.setItem(ingredientStorageKey, JSON.stringify(ownedIngredients));

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

let ingredientNames = {
    machine: "Coffee",
    "2percent": "2% Milk",
    oat: "Oat Milk",
    almond: "Almond Milk",
    chocolate: "Chocolate",
    strawberry: "Strawberry",
    pumpkin: "Pumpkin Syrup",
    vanilla: "Vanilla Syrup",
    rainbow: "Rainbow Sprinkles",
    choco: "Chocolate",
    sprinkles: "Rainbow Sprinkles",
    cinnamon: "Cinnamon",
    cream: "Whipped Cream",
    frappe: "Frappe",
    latte: "Latte"
};

let currentRecipe;
let completedIngredients = [];
let recipesCompleted = 0;

let recipeList = document.getElementById("recipe-items");
let sendButton = document.getElementById("sendbutton");

function getAvailableRecipes() {
    let ownedNames = ownedIngredients.map(item => ingredientNames[item] || item);

    return recipies.filter(recipe =>
        recipe.ingredients.every(ingredient => ownedNames.includes(ingredient))
    );
}

function newRecipe() {
    let availableRecipes = getAvailableRecipes();

    if (availableRecipes.length === 0) {
        recipeList.innerHTML = "<li>Buy more ingredients!</li>";
        currentRecipe = null;
        return;
    }

    currentRecipe = availableRecipes[
        Math.floor(Math.random() * availableRecipes.length)
    ];

    completedIngredients = [];
    recipeList.innerHTML = "";

    currentRecipe.ingredients.forEach(ingredient => {
        let listItem = document.createElement("li");
        listItem.textContent = ingredient;
        listItem.dataset.ingredient = ingredient;
        recipeList.appendChild(listItem);
    });
}

function updateRecipeList() {
    document.querySelectorAll("#recipe-items li").forEach(item => {
        if (completedIngredients.includes(item.dataset.ingredient)) {
            item.style.color = "green";
        }
    });
}

document.querySelectorAll(".ingredient-button").forEach(button => {
    button.addEventListener("click", () => {
        if (!currentRecipe || !button.classList.contains("unlocked")) {
            return;
        }

        let ingredient = ingredientNames[button.dataset.ingredient];

        if (
            currentRecipe.ingredients.includes(ingredient) &&
            !completedIngredients.includes(ingredient)
        ) {
            completedIngredients.push(ingredient);
            updateRecipeList();
        }
    });
});

if (sendButton) {
    sendButton.addEventListener("click", () => {
        if (!currentRecipe) {
            return;
        }

        if (completedIngredients.length !== currentRecipe.ingredients.length) {
            return;
        }

        let earnedCents = currentRecipe.price * 100;
        moneyCents += earnedCents;
        recipesCompleted++;

        localStorage.setItem(moneyStorageKey, String(moneyCents));
        localStorage.setItem(shiftEarningsKey, String(
            (Number(localStorage.getItem(shiftEarningsKey)) || 0) + earnedCents
        ));
        localStorage.setItem("coffeeClickerRecipesCompleted", String(recipesCompleted));

        updateMoneyDisplay();
        newRecipe();
    });
}

recipesCompleted = Number(
    localStorage.getItem("coffeeClickerRecipesCompleted")
) || 0;

if (recipeList) {
	newRecipe();
}


if (localStorage.getItem(moneyTestSeedKey) !== 'true') {
	moneyCents = startingMoneyCents;
	localStorage.setItem(moneyStorageKey, String(moneyCents));
	localStorage.setItem(moneyTestSeedKey, 'true');
} else if (!Number.isInteger(moneyCents) || moneyCents < 0) {
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
		const itemName = item.dataset.item;
		const priceCents = Number(item.dataset.priceCents);

		if (ownedIngredients.includes(itemName)) {
			if (shopMessage) {
				shopMessage.textContent = 'You already own this item.';
			}
			return;
		}

		if (moneyCents < priceCents) {
			if (shopMessage) {
				shopMessage.textContent = 'Not enough money. Come back after making more drinks!';
				shopMessage.classList.add('shop-message-error');
				shopMessage.classList.remove('shop-message-success');
			}
			return;
		}
		moneyCents -= priceCents;
		ownedIngredients.push(itemName);
		localStorage.setItem(ingredientStorageKey, JSON.stringify(ownedIngredients));
		localStorage.setItem(moneyStorageKey, String(moneyCents));
		if (Number(localStorage.getItem(timerStorageKey)) > Date.now()) {
			let shiftPurchasesCents = Number(localStorage.getItem(shiftPurchasesKey)) || 0;
			localStorage.setItem(shiftPurchasesKey, String(shiftPurchasesCents + priceCents));
		}
		updateMoneyDisplay();
		if (shopMessage) {
			shopMessage.textContent = `You bought ${item.dataset.item}!`;
			shopMessage.classList.add('shop-message-success');
			shopMessage.classList.remove('shop-message-error');
		}
	});
});

document.querySelectorAll('.ingredient-button').forEach((button) => {
	const isOwned = ownedIngredients.includes(button.dataset.ingredient);
	let selectedIngredients;

	try {
		selectedIngredients = JSON.parse(localStorage.getItem(selectedIngredientStorageKey));
	} catch {
		selectedIngredients = null;
	}

	if (!Array.isArray(selectedIngredients)) {
		selectedIngredients = [...starterIngredients];
	}

	button.classList.toggle('unlocked', isOwned);
	button.classList.toggle('selected', selectedIngredients.includes(button.dataset.ingredient));

	button.addEventListener('click', () => {
		if (button.classList.contains('unlocked')) {
			button.classList.toggle('selected');
			let selectedIngredientIds = [...document.querySelectorAll('.ingredient-button.selected')]
				.map((selectedButton) => selectedButton.dataset.ingredient);
			localStorage.setItem(selectedIngredientStorageKey, JSON.stringify(selectedIngredientIds));
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
		localStorage.setItem(moneyStorageKey, '0');
		localStorage.setItem(timerStorageKey, String(newTimerEnd));
		localStorage.setItem(shiftStartMoneyKey, '0');
		localStorage.setItem(shiftPurchasesKey, '0');
		localStorage.setItem(selectedIngredientStorageKey, JSON.stringify(starterIngredients));
		localStorage.removeItem(shiftEarningsKey);

        localStorage.setItem("coffeeClickerRecipesCompleted", "0");
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
        let recipesCompletedDisplay = document.getElementById("recipesCompleted");

        if (recipesCompletedDisplay) {
            recipesCompletedDisplay.textContent =
                localStorage.getItem("coffeeClickerRecipesCompleted") || 0;
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



