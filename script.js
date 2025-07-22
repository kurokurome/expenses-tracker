const descriptionsInput = document.getElementById("descriptions");
const amountInput = document.getElementById("amount");
const addTransactionBtn = document.getElementById("addTransaction");
const transactionsTable = document.getElementById("transactionsTable");
const expensesTotal = document.getElementById("expenses");
const setIncomeInput = document.getElementById("setIncome");
const setIncomeBtn = document.getElementById("setIncomeBtn");
const income = document.getElementById("income");
const totalBalance = document.getElementById("totalBalance");

// Displaying data onload
window.addEventListener("DOMContentLoaded", () => {
  getIncome();
  displayData();
  getTotalBalance();
});

// Adding new transaction data
addTransactionBtn.addEventListener("click", () => {
  if (descriptionsInput.value === "") {
    alert("Please input the required field!");
    return;
  } else if (amountInput.value < 1) {
    alert("Cannot input number lower than 1!");
    return;
  } else {
    transactionLocalStorage(descriptionsInput.value, amountInput.value);
  }
});

// Set income
setIncomeBtn.addEventListener("click", () => {
  if (setIncomeInput.value === "") {
    alert("Cannot input empty value!");
    return;
  } else if (setIncomeInput.value < 0) {
    alert("Cannot input number lower than 0!");
    return;
  } else {
    setIncome();
  }
});

// Formatting the numbers into currency format (IDR)
function formattedNumber(number) {
  const formatted = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(number);
  return formatted;
}

// Handle transactions data. Saving to local storage
function transactionLocalStorage(desc, amount) {
  let transactionsData;

  if (localStorage.getItem("transactionsData") === null) {
    transactionsData = [];
  } else {
    transactionsData = JSON.parse(localStorage.getItem("transactionsData"));
  }
  let uid = Date.now();
  const dataInput = {
    [desc]: amount,
  };
  const data = {
    [uid]: dataInput,
  };
  transactionsData.push(data);
  localStorage.setItem("transactionsData", JSON.stringify(transactionsData));
  descriptionsInput.value = "";
  amountInput.value = 1;

  displayData();
}

// Handle displaying data stored in local storage
function displayData() {
  transactionsTable.innerHTML = "";
  if (localStorage.getItem("transactionsData") === null) {
    transactionsData = [];
    localStorage.setItem("transactionsData", JSON.stringify(transactionsData));
  } else {
    transactionsData = JSON.parse(localStorage.getItem("transactionsData"));

    // Displaying transaction data stored in local storage
    transactionsData.forEach((transaction, index) => {
      const uid = Object.keys(transaction)[0];
      const detail = transaction[uid];

      const desc = Object.keys(detail)[0];
      const amount = detail[desc];

      const date = new Date(Number(uid));

      // Adding transaction data to page
      const dataElement = document.createElement("tr");
      dataElement.innerHTML = `<td>${index + 1}</td>
              <td>${desc}</td>
              <td>${formattedNumber(amount)}</td>
              <td>${date.toDateString()}</td>
              <td><button type="button" class="delete-button" title="Delete this transaction" data-key="${uid}">Delete</button></td>`;

      transactionsTable.appendChild(dataElement);

      // Call totalExpenses function to update the value
      totalExpenses();
    });

    // Handle the deletion of transaction
    document.querySelectorAll(".delete-button").forEach((button) => {
      button.addEventListener("click", function () {
        deleteTransaction(this.dataset.key);
        totalExpenses();
      });
    });

    // Calling income value that stored in local storage
    getIncome();

    getTotalBalance();
  }
}

// Handle the function when deleting a transaction
function deleteTransaction(uid) {
  let transactionsData = JSON.parse(localStorage.getItem("transactionsData"));

  transactionsData = transactionsData.filter((transaction) => !transaction.hasOwnProperty(uid));

  localStorage.setItem("transactionsData", JSON.stringify(transactionsData));

  displayData();
}

// Sum the amount of transactions
function totalExpenses() {
  let totalExpenses = 0;
  if (localStorage.getItem("transactionsData") === null) {
    totalExpenses = 0;
    return totalExpenses;
  } else {
    let transactionsData = JSON.parse(localStorage.getItem("transactionsData"));

    transactionsData.forEach((transaction) => {
      const uid = Object.keys(transaction)[0];
      const details = transaction[uid];
      const desc = Object.keys(details)[0];
      const amount = details[desc];

      totalExpenses += Number(amount);
    });

    expensesTotal.textContent = formattedNumber(totalExpenses);
    return totalExpenses;
  }
}

// Set the income value inside input
function setIncome() {
  const incomeInputed = setIncomeInput.value;

  const saveToLocal = localStorage.setItem("income", incomeInputed);

  income.textContent = formattedNumber(setIncomeInput.value);
  displayData();
}

function getIncome() {
  const getIncomeData = localStorage.getItem("income") || "0";
  income.textContent = formattedNumber(getIncomeData);
}

function getTotalBalance() {
  const getIncomeData = localStorage.getItem("income") || "0";
  totalBalance.textContent = formattedNumber(Number(getIncomeData) - totalExpenses());
}
