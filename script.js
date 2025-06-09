document.addEventListener("DOMContentLoaded", () => {
  const expenseForm = document.getElementById("expense-form");
  const expenseNameInput = document.getElementById("expense-name");
  const expenseAmountInput = document.getElementById("expense-amount");
  const expenseList = document.getElementById("expense-list");
  const totalAmountDisplay = document.getElementById("total-amount");

  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  let totalAmount = calculateTotal();
  let isEditing = false;
  let editId = null;

  renderExpenses();

  expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value.trim());

    if (name !== "" && !isNaN(amount) && amount > 0) {
      if (isEditing) {
        // Update existing expense
        expenses = expenses.map((expense) =>
          expense.id === editId ? { ...expense, name, amount } : expense
        );
        isEditing = false;
        editId = null;
        expenseForm.querySelector("button[type='submit']").textContent =
          "Add Expense";
      } else {
        // Add new expense
        const newExpense = {
          id: Date.now(),
          name: name,
          amount: amount,
        };
        expenses.push(newExpense);
      }

      saveExpensesToLocal();
      renderExpenses();
      updateTotal();

      // Add animation feedback
      expenseForm.classList.add("success");
      setTimeout(() => expenseForm.classList.remove("success"), 1000);

      // Clear input
      expenseNameInput.value = "";
      expenseAmountInput.value = "";
      expenseNameInput.focus();
    } else {
      // Add error feedback
      expenseForm.classList.add("error");
      setTimeout(() => expenseForm.classList.remove("error"), 1000);
    }
  });

  function renderExpenses() {
    expenseList.innerHTML = "";
    if (expenses.length === 0) {
      const emptyMsg = document.createElement("div");
      emptyMsg.textContent = "No expenses added yet";
      emptyMsg.style.textAlign = "center";
      emptyMsg.style.color = "#aaa";
      emptyMsg.style.padding = "20px";
      expenseList.appendChild(emptyMsg);
      return;
    }

    expenses.forEach((expense) => {
      const li = document.createElement("li");
      li.style.opacity = "0";
      li.style.transform = "translateX(-20px)";
      li.innerHTML = `
        <span>${expense.name}</span>
        <div>
          <span class="amount">$${expense.amount.toFixed(2)}</span>
          <button class="edit-btn" data-id="${expense.id}">✏️</button>
          <button class="delete-btn" data-id="${expense.id}">×</button>
        </div>
      `;
      expenseList.appendChild(li);

      // Animate entry
      setTimeout(() => {
        li.style.opacity = "1";
        li.style.transform = "translateX(0)";
        li.style.transition = "all 0.3s ease";
      }, 10);
    });
  }

  function calculateTotal() {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  function saveExpensesToLocal() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  function updateTotal() {
    totalAmount = calculateTotal();
    totalAmountDisplay.textContent = totalAmount.toFixed(2);

    // Animate total update
    totalAmountDisplay.style.transform = "scale(1.2)";
    totalAmountDisplay.style.color = "#4caf50";
    setTimeout(() => {
      totalAmountDisplay.style.transform = "scale(1)";
    }, 300);
  }

  expenseList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const expenseId = parseInt(e.target.getAttribute("data-id"));
      const expenseItem = e.target.closest("li");

      // Animate removal
      expenseItem.style.transform = "translateX(100%)";
      expenseItem.style.opacity = "0";
      expenseItem.style.transition = "all 0.3s ease";

      setTimeout(() => {
        expenses = expenses.filter((expense) => expense.id !== expenseId);
        saveExpensesToLocal();
        renderExpenses();
        updateTotal();
      }, 300);
    } else if (e.target.classList.contains("edit-btn")) {
      const expenseId = parseInt(e.target.getAttribute("data-id"));
      const expenseToEdit = expenses.find(
        (expense) => expense.id === expenseId
      );

      if (expenseToEdit) {
        isEditing = true;
        editId = expenseId;
        expenseNameInput.value = expenseToEdit.name;
        expenseAmountInput.value = expenseToEdit.amount;
        expenseNameInput.focus();
        expenseForm.querySelector("button[type='submit']").textContent =
          "Update Expense";
      }
    }
  });
});
