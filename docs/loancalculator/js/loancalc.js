// 新增右側折疊按鈕功能
const toggleBtnRight = document.getElementById("toggleBtnRight");
const toggleIconRight = document.getElementById("toggleIconRight");

toggleBtnRight.addEventListener("click", () => {
  if (toggleContent.classList.contains("toggle-content")) {
    toggleContent.classList.remove("toggle-content");
    toggleIconRight.classList.remove("fa-plus");
    toggleIconRight.classList.add("fa-minus");
  } else {
    toggleContent.classList.add("toggle-content");
    toggleIconRight.classList.remove("fa-minus");
    toggleIconRight.classList.add("fa-plus");
  }
});

// DOM元素
const loanAmountInput = document.getElementById("loanAmount");
const loanAmountSlider = document.getElementById("loanAmountSlider");
const loanTermInput = document.getElementById("loanTerm");
const loanTermSlider = document.getElementById("loanTermSlider");
const aprRateInput = document.getElementById("aprRate");
const aprRateSlider = document.getElementById("aprRateSlider");
const flatRateInput = document.getElementById("flatRate");
const flatRateSlider = document.getElementById("flatRateSlider");
const calculateBtn = document.getElementById("calculateBtn");
const resultsContainer = document.getElementById("resultsContainer");
const loanPlansContainer = document.getElementById("loanPlansContainer");

// 利率類型切換元素
const aprTab = document.getElementById("aprTab");
const flatTab = document.getElementById("flatTab");
const aprRateContainer = document.getElementById("aprRateContainer");
const flatRateContainer = document.getElementById("flatRateContainer");

// 折疊功能元素
const toggleHeader = document.getElementById("toggleHeader");
const toggleContent = document.getElementById("toggleContent");
const toggleIcon = document.getElementById("toggleIcon");

// 當前利率類型 (默認實際年利率)
let currentRateType = "apr";

// 折疊/展開功能
toggleHeader.addEventListener("click", () => {
  if (toggleContent.classList.contains("toggle-content")) {
    toggleContent.classList.remove("toggle-content");
    toggleIcon.innerHTML = '<i class="fas fa-minus"></i>';
  } else {
    toggleContent.classList.add("toggle-content");
    toggleIcon.innerHTML = '<i class="fas fa-plus"></i>';
  }
});

// 利率類型切換
aprTab.addEventListener("click", () => {
  currentRateType = "apr";
  aprTab.classList.add("active");
  flatTab.classList.remove("active");
  aprRateContainer.classList.remove("hidden");
  flatRateContainer.classList.add("hidden");
});

flatTab.addEventListener("click", () => {
  currentRateType = "flat";
  flatTab.classList.add("active");
  aprTab.classList.remove("active");
  flatRateContainer.classList.remove("hidden");
  aprRateContainer.classList.add("hidden");
});

// 同步輸入和滑塊的值
function syncInputAndSlider(input, slider) {
  input.addEventListener("input", () => {
    slider.value = input.value;
  });

  slider.addEventListener("input", () => {
    input.value = slider.value;
  });
}

// 初始化同步
syncInputAndSlider(loanAmountInput, loanAmountSlider);
syncInputAndSlider(loanTermInput, loanTermSlider);
syncInputAndSlider(aprRateInput, aprRateSlider);
syncInputAndSlider(flatRateInput, flatRateSlider);

// 格式化貨幣
function formatCurrency(amount) {
  return new Intl.NumberFormat("zh-HK", {
    style: "currency",
    currency: "HKD",
    minimumFractionDigits: 0,
  }).format(amount);
}

// ＳＴＡＲＴ  精确的月平息转换为实际年利率計算
function flatToApr(flatRate, term) {
  const monthlyFlatRate = flatRate / 100;
  const totalInterest = monthlyFlatRate * term * 100; // 假设贷款额为100元
  const monthlyPayment = (100 + totalInterest) / term;

  // 使用二分法计算实际月利率
  let low = 0;
  let high = 1; // 100% APR作为上限
  let monthlyRate = (low + high) / 2;
  const precision = 0.000001;

  for (let i = 0; i < 100; i++) {
    const calculatedPayment =
      (100 * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));

    if (Math.abs(calculatedPayment - monthlyPayment) < precision) {
      break;
    }

    if (calculatedPayment > monthlyPayment) {
      high = monthlyRate;
    } else {
      low = monthlyRate;
    }

    monthlyRate = (low + high) / 2;
  }

  // 将月利率转换为年利率
  const apr = (Math.pow(1 + monthlyRate, 12) - 1) * 100;
  return apr;
}

// 实际年利率转换为月平息
function aprToFlat(aprRate, term) {
  // 将年利率转换为月利率
  const monthlyRate = Math.pow(1 + aprRate / 100, 1 / 12) - 1;

  // 计算100元贷款的总还款额
  const totalPayment =
    ((100 * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term))) * term;
  const totalInterest = totalPayment - 100;

  // 计算月平息
  const flatRate = (totalInterest / term / 100) * 100; // 转换为百分比

  return flatRate;
}
// END　精确的月平息转换为实际年利率計算

// 計算每月還款額（實際年利率）
function calculateMonthlyPaymentFromApr(amount, rate, term) {
  const monthlyRate = rate / 100 / 12;
  const payment =
    (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
  return payment;
}

// 計算每月還款額（月平息）
function calculateMonthlyPaymentFromFlat(amount, flatRate, term) {
  // 月平息計算方式：每月利息 = 貸款金額 * 月平息
  // 每月還款額 = (貸款金額 / 期數) + (貸款金額 * 月平息)
  const monthlyInterest = amount * (flatRate / 100);
  const monthlyPrincipal = amount / term;
  return monthlyPrincipal + monthlyInterest;
}

// 計算貸款詳情
function calculateLoanDetails() {
  const amount = parseFloat(loanAmountInput.value);
  const term = parseInt(loanTermInput.value);
  let rate;
  let rateType;

  if (currentRateType === "apr") {
    rate = parseFloat(aprRateInput.value);
    rateType = "實際年利率";
  } else {
    rate = parseFloat(flatRateInput.value);
    rateType = "月平息";
  }

  if (
    isNaN(amount) ||
    isNaN(term) ||
    isNaN(rate) ||
    amount <= 0 ||
    term <= 0 ||
    rate <= 0
  ) {
    alert("請輸入有效的貸款信息");
    return;
  }

  // 確保計算器展開
  if (toggleContent.classList.contains("toggle-content")) {
    toggleContent.classList.remove("toggle-content");
    toggleIcon.innerHTML = '<i class="fas fa-minus"></i>';
  }

  let monthlyPayment;
  let totalPayment;
  let totalInterest;
  let aprRate;
  let flatRate;

  if (currentRateType === "apr") {
    monthlyPayment = calculateMonthlyPaymentFromApr(amount, rate, term);
    totalPayment = monthlyPayment * term;
    totalInterest = totalPayment - amount;
    aprRate = rate;
    flatRate = aprToFlat(rate, term);
  } else {
    monthlyPayment = calculateMonthlyPaymentFromFlat(amount, rate, term);
    totalPayment = monthlyPayment * term;
    totalInterest = totalPayment - amount;
    flatRate = rate;
    aprRate = flatToApr(rate, term);
  }

  // 更新結果容器
  resultsContainer.innerHTML = `
                <div class="result-card">
                    <div class="flex justify-between items-center mb-3 border-b pb-2">
                        <h3 class="font-bold text-lg">貸款摘要</h3>
                        <span class="px-3 py-1 bg-blue-100 text-[#2563eb] text-sm rounded-full">
                            通用方案
                        </span>
                    </div>
                    
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="text-gray-600 flex items-center">
                                <i class="fas fa-wallet text-[#2563eb] mr-2"></i> 貸款總額
                            </span>
                            <span class="font-semibold">${formatCurrency(
                              amount
                            )}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 flex items-center">
                                <i class="fas fa-calendar-check text-[#2563eb] mr-2"></i> 貸款期限
                            </span>
                            <span class="font-semibold">${term} 個月</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 flex items-center">
                                <i class="fas fa-percent text-[#2563eb] mr-2"></i> 實際年利率
                            </span>
                            <span class="font-semibold">${aprRate.toFixed(
                              2
                            )}%</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 flex items-center">
                                <i class="fas fa-chart-line text-[#2563eb] mr-2"></i> 月平息
                            </span>
                            <span class="font-semibold">${flatRate.toFixed(
                              4
                            )}%</span>
                        </div>
                        <div class="flex justify-between pt-3 border-t">
                            <span class="text-gray-600 font-medium flex items-center">
                                <i class="fas fa-credit-card text-[#2563eb] mr-2"></i> 每月還款額
                            </span>
                            <span class="font-semibold">${formatCurrency(
                              monthlyPayment
                            )}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 flex items-center">
                                <i class="fas fa-coins text-[#2563eb] mr-2"></i> 總利息
                            </span>
                            <span class="font-semibold">${formatCurrency(
                              totalInterest
                            )}</span>
                        </div>
                        <div class="flex justify-between pt-3 border-t border-blue-200">
                            <span class="text-gray-800 font-medium flex items-center">
                                <i class="fas fa-receipt text-[#2563eb] mr-2"></i> 總還款額
                            </span>
                            <span class="font-semibold text-[#2563eb] text-lg">${formatCurrency(
                              totalPayment
                            )}</span>
                        </div>
                    </div>
                </div>
                
                <div class="mt-4">
                    <button class="w-full bg-[#2563eb] hover:bg-[#1e40af] text-white py-3 px-4 rounded-md font-medium transition flex items-center justify-center">
                        <i class="fas fa-file-alt mr-2"></i> 申請此貸款方案
                    </button>
                </div>

                <div class="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded-lg text-md">
                    <p class="font-medium">說明：</p>
                    <p>實際年利率(APR)採用等額本息計算，月平息(Flat)採用均等本息計算。因計息方式不同，每月還款額存在差異：</p>
                    <ul class="list-disc pl-5 mt-2">
                      <li><strong>APR 模型</strong>：利息隨本金遞減，前期還款利息較高</li>
                      <li><strong>Flat 模型</strong>：每月利息固定，總利息通常低於 APR</li>
                    </ul>
                </div>
            `;

  // 生成貸款方案卡片
  generateLoanPlans(amount, term);
}

// 生成貸款方案卡片（核心修改点）
function generateLoanPlans(amount, term) {
  // UPDATE: 动态获取基础利率（根据当前选择的输入方式）
  let baseAprRate;
  if (currentRateType === "apr") {
    baseAprRate = parseFloat(aprRateInput.value);
  } else {
    baseAprRate = flatToApr(parseFloat(flatRateInput.value), term);
  }

  // UPDATE: 确保利率有效
  if (isNaN(baseAprRate)) {
    console.error("Invalid interest rate input");
    return;
  }

  // 清空容器並先插入說明區塊
  loanPlansContainer.innerHTML = "";

  const cashReward = amount * 0.01; // UPDATE: 新增动态计算回赠金额

  const plans = [
    {
      name: "通用標準方案",
      aprRate: baseAprRate, // UPDATE: 使用动态基础利率
      features: [
        "HKD 0 手續費 (指定銀行/財務公司)",
        "審批時間＜24小時",
        "靈活還款期（3–60/3-84個月）",
        "無抵押要求",
      ],
      specialOffer: null,
    },
    {
      name: "特惠方案",
      aprRate: baseAprRate * 0.9, // UPDATE: 基于动态基础利率计算
      features: [
        `現金回贈 ${formatCurrency(cashReward)}（新客戶)`,
        "預先審批評估",
        "最低實際年利率 4.95%（指定金額）",
        "提前還款無罰息 (指定銀行/財務公司)",
      ],
      specialOffer: "限時新客戶九折專享",
      terms:
        " 優惠須通過信用評估，銀行/財務公司有權隨時終止有關優惠或修改其詳情及條款及細則而不作另行通知。", // 新增条款说明
    },
  ];

  plans.forEach((plan, index) => {
    const monthlyPayment = calculateMonthlyPaymentFromApr(
      amount,
      plan.aprRate,
      term
    );
    const totalPayment = monthlyPayment * term;
    const flatRate = aprToFlat(plan.aprRate, term);

    loanPlansContainer.innerHTML += `
                    <div class="result-card bg-white rounded-lg overflow-hidden border ${
                      index === 1 ? "border-[#2563eb]" : "border-gray-200"
                    }">
                        ${
                          index === 1
                            ? `
                        <div class="bg-[#2563eb] text-white p-3 text-center">
                            <span class="text-xl font-medium">限時優惠</span>
                        </div>
                        `
                            : ""
                        }
                        
                        <div class="p-5">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="font-bold text-xl">${plan.name}</h3>
                                ${
                                  index === 1 && plan.specialOffer
                                    ? `
                                <span class="bg-yellow-100 text-yellow-800 text-md px-2 py-1 rounded-full">${plan.specialOffer}</span>
                                `
                                    : ""
                                }
                            </div>
                            
                            <div class="grid grid-cols-2 gap-4 mb-5">
                                <div class="text-center">
                                    <span class="text-2xl font-bold ${
                                      index === 1
                                        ? "text-[#2563eb]"
                                        : "text-gray-800"
                                    }">${plan.aprRate.toFixed(2)}%</span>
                                    <span class="text-gray-600 block mt-1">實際年利率</span>
                                </div>
                                <div class="text-center">
                                    <span class="text-2xl font-bold ${
                                      index === 1
                                        ? "text-[#2563eb]"
                                        : "text-gray-800"
                                    }">${flatRate.toFixed(4)}%</span>
                                    <span class="text-gray-600 block mt-1">月平息</span>
                                </div>
                            </div>
                            
                            <div class="mb-5">
                                <h4 class="font-medium text-gray-700 mb-3 flex items-center text-xl">
                                    <i class="fas fa-star text-yellow-400 mr-2 text-xl"></i> 方案特點
                                </h4>
                                <ul class="space-y-2 text-xl">
                                    ${plan.features
                                      .map(
                                        (
                                          feature
                                        ) => `<li class="flex items-center">
                                        <i class="fas fa-check-circle text-green-500 mr-2"></i> ${feature}
                                    </li>`
                                      )
                                      .join("")}
                                </ul>
                            </div>

                            <!-- UPDATE: 新增条款显示区域 -->
                              ${
                                plan.terms
                                  ? `
                                <div class="mt-3 text-md text-gray-500 border-t pt-2">
                                  <i class="fas fa-info-circle mr-1"></i> ${plan.terms}
                                </div>
                            `
                                  : ""
                              }
                            
                            <div class="mb-4 bg-blue-50 p-3 rounded-lg">
                                <div class="flex justify-between mb-1">
                                    <span class="text-gray-600 text-xl">每月還款</span>
                                    <span class="font-semibold text-xl">${formatCurrency(
                                      monthlyPayment
                                    )}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600 text-xl">總還款額</span>
                                    <span class="font-semibold text-xl">${formatCurrency(
                                      totalPayment
                                    )}</span>
                                </div>
                            </div>
                            
                            <button class="w-full ${
                              index === 1
                                ? "bg-[#2563eb] hover:bg-[#1e40af]"
                                : "bg-gray-800 hover:bg-gray-700"
                            } text-white py-2.5 px-4 rounded-md font-medium transition flex items-center justify-center">
                                <i class="fas fa-paper-plane mr-2"></i> 立即申請
                            </button>
                        </div>
                    </div>
                `;
  });
}

// 事件監聽
calculateBtn.addEventListener("click", calculateLoanDetails);

// 頁面加載時初始化
document.addEventListener("DOMContentLoaded", () => {
  // 設置默認值
  loanAmountInput.value = 300000;
  loanAmountSlider.value = 300000;
  loanTermInput.value = 36;
  loanTermSlider.value = 36;
  aprRateInput.value = 5.5;
  aprRateSlider.value = 5.5;
  flatRateInput.value = aprToFlat(5.5, 36).toFixed(4);
  flatRateSlider.value = aprToFlat(5.5, 36);

  // 確保滑塊值同步
  syncInputAndSlider(loanAmountInput, loanAmountSlider);
  syncInputAndSlider(loanTermInput, loanTermSlider);
  syncInputAndSlider(aprRateInput, aprRateSlider);
  syncInputAndSlider(flatRateInput, flatRateSlider);
});
