// 顯示/隱藏計算器表單
document
  .querySelector(".toggle-calc-btn")
  .addEventListener("click", function () {
    const form = document.querySelector(".calculator-form");
    const btn = this;

    form.classList.toggle("show");

    if (form.classList.contains("show")) {
      btn.textContent = "-";
    } else {
      btn.textContent = "+";
      // 隱藏結果區域當表單隱藏時
      document.querySelector(".calculation-results").classList.remove("show");
    }
  });

// 更新滑塊數值顯示
function updateSliderValue(sliderId, displayId, isCurrency = false) {
  const slider = document.getElementById(sliderId);
  const display = document.getElementById(displayId);

  slider.addEventListener("input", function () {
    if (isCurrency) {
      display.textContent = Number(this.value).toLocaleString("en-HK");
    } else {
      display.textContent = this.value;
    }
  });
}

updateSliderValue("loan-amount", "loan-amount-value", true);
updateSliderValue("loan-term", "loan-term-value");
updateSliderValue("interest-rate", "interest-rate-value");

// 計算貸款還款
document.getElementById("calculate-btn").addEventListener("click", function () {
  const amount = parseFloat(document.getElementById("loan-amount").value);
  const term = parseInt(document.getElementById("loan-term").value);
  const rate = parseFloat(document.getElementById("interest-rate").value) / 100; // 轉換為小數

  // 計算每月平息還款
  const monthlyInterest = amount * rate;
  const monthlyPrincipal = amount / term;
  const monthlyPayment = monthlyInterest + monthlyPrincipal;

  // 計算總還款和總利息
  const totalPayment = monthlyPayment * term;
  const totalInterest = totalPayment - amount;

  // 顯示結果
  document.getElementById("monthly-payment").textContent =
    "HK$" + Math.round(monthlyPayment).toLocaleString("en-HK");
  document.getElementById("total-payment").textContent =
    "HK$" + Math.round(totalPayment).toLocaleString("en-HK");
  document.getElementById("total-interest").textContent =
    "HK$" + Math.round(totalInterest).toLocaleString("en-HK");

  // 顯示結果區域
  document.querySelector(".calculation-results").classList.add("show");
});
