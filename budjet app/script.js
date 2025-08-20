// ==========================
// Sélection des éléments HTML
// ==========================
let totalAmount = document.getElementById("total-amount");
let userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTitle = document.getElementById("product-title");

const errorMessage = document.getElementById("budget-error");
const productTitleError = document.getElementById("product-title-error");

const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");

let tempAmount = 0; // Stockage du budget en mémoire

// ==========================
// Sauvegarde dans localStorage
// ==========================
function saveData(budget, expenses, totalExpenses, balance) {
  localStorage.setItem("budget", budget);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  localStorage.setItem("expensesTotal", totalExpenses);
  localStorage.setItem("balance", balance);
}

// Charger les données depuis localStorage
function loadData() {
  let budget = localStorage.getItem("budget");
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  let totalExpenses = localStorage.getItem("expensesTotal");
  let balance = localStorage.getItem("balance");

  if (budget) {
    amount.innerText = budget;
    expenditureValue.innerText = totalExpenses || 0;
    balanceValue.innerText = balance || budget;
    tempAmount = parseInt(budget);
  }

  // Recréer la liste des dépenses
  expenses.forEach(exp => {
    listCreator(exp.name, exp.amount);
  });
}

// ==========================
// Définir le budget
// ==========================
totalAmountButton.addEventListener("click", () => {
  tempAmount = totalAmount.value;

  if (tempAmount === "" || tempAmount < 0) {
    errorMessage.classList.remove("hide");
  } else {
    errorMessage.classList.add("hide");

    amount.innerText = tempAmount;
    balanceValue.innerText = tempAmount - expenditureValue.innerText;
    totalAmount.value = "";

    // Sauvegarde
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    saveData(tempAmount, expenses, expenditureValue.innerText, balanceValue.innerText);
  }
});

// ==========================
// Désactiver/activer boutons edit
// ==========================
const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};

// ==========================
// Modifier ou Supprimer un élément
// ==========================
const modifyElement = (element, edit = false) => {
  let parentDiv = element.parentElement;
  let currentBalance = balanceValue.innerText;
  let currentExpense = expenditureValue.innerText;
  let parentAmount = parentDiv.querySelector(".amount").innerText;

  if (edit) {
    let parentText = parentDiv.querySelector(".product").innerText;
    productTitle.value = parentText;
    userAmount.value = parentAmount;
    disableButtons(true);
  }

  balanceValue.innerText = parseInt(currentBalance) + parseInt(parentAmount);
  expenditureValue.innerText = parseInt(currentExpense) - parseInt(parentAmount);

  // Mettre à jour le localStorage
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses = expenses.filter(
    exp => !(exp.name === parentDiv.querySelector(".product").innerText && exp.amount == parentAmount)
  );

  saveData(tempAmount, expenses, expenditureValue.innerText, balanceValue.innerText);

  parentDiv.remove();
};

// ==========================
// Créer un élément de liste
// ==========================
const listCreator = (expenseName, expenseValue) => {
  let sublistContent = document.createElement("div");
  sublistContent.classList.add("sublist-content", "flex-space");

  sublistContent.innerHTML = `
    <p class="product">${expenseName}</p>
    <p class="amount">${expenseValue}</p>
  `;

  // Bouton Edit
  let editButton = document.createElement("button");
  editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
  editButton.style.fontSize = "1.2em";
  editButton.addEventListener("click", () => {
    modifyElement(editButton, true);
  });

  // Bouton Delete
  let deleteButton = document.createElement("button");
  deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
  deleteButton.style.fontSize = "1.2em";
  deleteButton.addEventListener("click", () => {
    modifyElement(deleteButton);
  });

  sublistContent.appendChild(editButton);
  sublistContent.appendChild(deleteButton);
  list.appendChild(sublistContent);
};

// ==========================
// Ajouter une dépense
// ==========================
checkAmountButton.addEventListener("click", () => {
  if (!userAmount.value || !productTitle.value) {
    productTitleError.classList.remove("hide");
    return false;
  }

  disableButtons(false);

  let expenditure = parseInt(userAmount.value);
  let sum = parseInt(expenditureValue.innerText) + expenditure;
  expenditureValue.innerText = sum;

  const totalBalance = tempAmount - sum;
  balanceValue.innerText = totalBalance;

  // Créer l’élément
  listCreator(productTitle.value, userAmount.value);

  // Sauvegarder
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses.push({ name: productTitle.value, amount: expenditure });
  saveData(tempAmount, expenses, sum, totalBalance);

  // Réinitialiser inputs
  productTitle.value = "";
  userAmount.value = "";
});

// ==========================
// Charger les données au démarrage
// ==========================
window.addEventListener("load", loadData);
