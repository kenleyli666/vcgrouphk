// DOM元素
const websiteUrlInput = document.getElementById("websiteUrl");
const singleTestBtn = document.getElementById("singleTestBtn");
const continuousTestBtn = document.getElementById("continuousTestBtn");
const loadingElement = document.getElementById("loading");
const resultsContainer = document.getElementById("resultsContainer");
const testProgress = document.getElementById("testProgress");
const singleTestSection = document.getElementById("singleTestSection");
const continuousTestSection = document.getElementById("continuousTestSection");
const testResultsBody = document.getElementById("testResultsBody");
const avgOverall = document.getElementById("avgOverall");
const avgSpeed = document.getElementById("avgSpeed");
const avgMobile = document.getElementById("avgMobile");
const avgSeo = document.getElementById("avgSeo");
const conclusionText = document.getElementById("conclusionText");

// 進度環元素
const progressCircle = document.querySelector(".progress-ring__circle");
const circumference = 2 * Math.PI * 52;

// 初始化進度環
progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
progressCircle.style.strokeDashoffset = circumference;

// 圖表實例
let scoreChart = null;

// 設置進度
function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  progressCircle.style.strokeDashoffset = offset;
}

// 分析網站SEO
async function analyzeSEO(isContinuous = false, testNumber = 1) {
  const url = websiteUrlInput.value.trim();

  if (!url) {
    alert("請輸入網站URL");
    return;
  }

  try {
    if (!isContinuous) {
      // 顯示加載狀態
      loadingElement.classList.remove("hidden");
      resultsContainer.classList.add("hidden");
      singleTestSection.classList.remove("hidden");
      continuousTestSection.classList.add("hidden");
    } else {
      testProgress.textContent = `正在進行第 ${testNumber} 次測試...`;
    }

    // 模擬網絡請求延遲
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 獲取選擇的策略
    const strategy = document.querySelector(
      'input[name="strategy"]:checked'
    ).value;

    // 本地分析邏輯
    const analysisResults = localSEOAnalysis(url, strategy);

    // 處理分析結果
    if (!isContinuous) {
      processSingleResults(analysisResults);
    } else {
      return analysisResults;
    }

    // 顯示結果
    if (!isContinuous) {
      loadingElement.classList.add("hidden");
      resultsContainer.classList.remove("hidden");
    }
  } catch (error) {
    console.error("分析失敗:", error);
    if (!isContinuous) {
      loadingElement.classList.add("hidden");
    }
    alert(`分析失敗: ${error.message}`);
  }
}

// 連續測試
async function runContinuousTests() {
  const url = websiteUrlInput.value.trim();

  if (!url) {
    alert("請輸入網站URL");
    return;
  }

  try {
    // 顯示加載狀態
    loadingElement.classList.remove("hidden");
    resultsContainer.classList.add("hidden");
    singleTestSection.classList.add("hidden");
    continuousTestSection.classList.remove("hidden");

    // 清空之前的測試結果
    testResultsBody.innerHTML = "";

    const testResults = [];

    // 進行3次測試
    for (let i = 1; i <= 3; i++) {
      const result = await analyzeSEO(true, i);
      testResults.push(result);

      // 添加結果到表格
      addTestResultToTable(i, result);
    }

    // 計算平均值
    calculateAverages(testResults);

    // 生成圖表
    generateScoreChart(testResults);

    // 生成結論
    generateConclusion(testResults);

    // 顯示結果
    loadingElement.classList.add("hidden");
    resultsContainer.classList.remove("hidden");
  } catch (error) {
    console.error("連續測試失敗:", error);
    loadingElement.classList.add("hidden");
    alert(`連續測試失敗: ${error.message}`);
  }
}

// 本地SEO分析邏輯
function localSEOAnalysis(url, strategy) {
  // 模擬分析結果
  const scores = {
    overall: Math.floor(Math.random() * 40) + 60, // 60-100分
    speed: Math.floor(Math.random() * 40) + 60,
    mobile: Math.floor(Math.random() * 40) + 60,
    seo: Math.floor(Math.random() * 40) + 60,
    title: Math.random() > 0.3 ? "良好" : "需優化",
    description: Math.random() > 0.4 ? "良好" : "需優化",
    alt: Math.random() > 0.5 ? "良好" : "需優化",
    schema: Math.random() > 0.6 ? "已使用" : "未使用",
    keywordDensity: (Math.random() * 3 + 1).toFixed(1) + "%",
    readability: Math.random() > 0.4 ? "良好" : "需優化",
    internalLinks: Math.floor(Math.random() * 20) + 5,
    externalLinks: Math.floor(Math.random() * 10),
    timestamp: new Date().toLocaleTimeString(),
  };

  // 生成優化建議
  const suggestions = [
    "優化頁面標題標籤，包含主要關鍵詞",
    "添加或完善元描述標籤",
    "為所有圖片添加ALT屬性",
    "增加內部鏈接以提高網站結構",
    "優化移動設備顯示效果",
    "減少頁面加載時間，壓縮圖片資源",
  ];

  // 根據策略調整分數
  if (strategy === "mobile") {
    scores.mobile = Math.min(100, scores.mobile + 10);
  } else {
    scores.speed = Math.min(100, scores.speed + 10);
  }

  return {
    url,
    strategy,
    scores,
    suggestions,
  };
}

// 處理單次分析結果
function processSingleResults(results) {
  const scores = results.scores;

  // 綜合評分
  document.getElementById("overallScore").textContent = scores.overall;
  setProgress(scores.overall);

  // 關鍵指標
  updateMetric("speed", scores.speed);
  updateMetric("mobile", scores.mobile);
  updateMetric("seo", scores.seo);

  // 技術指標
  document.getElementById("titleScore").textContent = scores.title;
  document.getElementById("descriptionScore").textContent = scores.description;
  document.getElementById("altScore").textContent = scores.alt;
  document.getElementById("schemaScore").textContent = scores.schema;

  // 內容優化
  document.getElementById("keywordDensity").textContent = scores.keywordDensity;
  document.getElementById("readability").textContent = scores.readability;
  document.getElementById("internalLinks").textContent = scores.internalLinks;
  document.getElementById("externalLinks").textContent = scores.externalLinks;

  // 優化建議
  displaySuggestions(results.suggestions);
}

// 添加測試結果到表格
function addTestResultToTable(testNumber, results) {
  const scores = results.scores;
  const row = document.createElement("tr");

  row.innerHTML = `
        <td>${testNumber}</td>
        <td>${scores.overall}</td>
        <td>${scores.speed}</td>
        <td>${scores.mobile}</td>
        <td>${scores.seo}</td>
        <td>${scores.title}</td>
        <td>${scores.description}</td>
        <td>${scores.timestamp}</td>
    `;

  testResultsBody.appendChild(row);
}

// 計算平均值
function calculateAverages(testResults) {
  let totalOverall = 0;
  let totalSpeed = 0;
  let totalMobile = 0;
  let totalSeo = 0;

  testResults.forEach((result) => {
    totalOverall += result.scores.overall;
    totalSpeed += result.scores.speed;
    totalMobile += result.scores.mobile;
    totalSeo += result.scores.seo;
  });

  avgOverall.textContent = (totalOverall / 3).toFixed(1);
  avgSpeed.textContent = (totalSpeed / 3).toFixed(1);
  avgMobile.textContent = (totalMobile / 3).toFixed(1);
  avgSeo.textContent = (totalSeo / 3).toFixed(1);
}

// 生成分數圖表
function generateScoreChart(testResults) {
  const ctx = document.getElementById("scoreChart").getContext("2d");

  // 如果已有圖表實例，先銷毀
  if (scoreChart) {
    scoreChart.destroy();
  }

  const labels = ["測試 1", "測試 2", "測試 3"];
  const overallScores = testResults.map((r) => r.scores.overall);
  const speedScores = testResults.map((r) => r.scores.speed);
  const mobileScores = testResults.map((r) => r.scores.mobile);
  const seoScores = testResults.map((r) => r.scores.seo);

  scoreChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "綜合評分",
          data: overallScores,
          backgroundColor: "rgba(59, 130, 246, 0.7)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 1,
        },
        {
          label: "加載速度",
          data: speedScores,
          backgroundColor: "rgba(16, 185, 129, 0.7)",
          borderColor: "rgba(16, 185, 129, 1)",
          borderWidth: 1,
        },
        {
          label: "移動適配",
          data: mobileScores,
          backgroundColor: "rgba(245, 158, 11, 0.7)",
          borderColor: "rgba(245, 158, 11, 1)",
          borderWidth: 1,
        },
        {
          label: "SEO優化",
          data: seoScores,
          backgroundColor: "rgba(139, 92, 246, 0.7)",
          borderColor: "rgba(139, 92, 246, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
          min: 50,
          max: 100,
          title: {
            display: true,
            text: "分數",
          },
        },
      },
    },
  });
}

// 生成結論
function generateConclusion(testResults) {
  const overallScores = testResults.map((r) => r.scores.overall);
  const avgScore = overallScores.reduce((a, b) => a + b, 0) / 3;

  let conclusion = "";

  if (avgScore >= 85) {
    conclusion = `您的網站SEO表現非常出色，平均得分${avgScore.toFixed(
      1
    )}分。繼續保持當前優化策略，定期監測關鍵指標。`;
  } else if (avgScore >= 70) {
    conclusion = `您的網站SEO表現良好，平均得分${avgScore.toFixed(
      1
    )}分。建議關注移動設備適配和頁面加載速度的優化。`;
  } else if (avgScore >= 60) {
    conclusion = `您的網站SEO表現一般，平均得分${avgScore.toFixed(
      1
    )}分。需要重點優化SEO基礎和技術指標，特別是標題標籤和描述標籤。`;
  } else {
    conclusion = `您的網站SEO表現有待提高，平均得分${avgScore.toFixed(
      1
    )}分。建議全面檢查SEO優化策略，特別是移動設備適配和頁面加載速度。`;
  }

  // 添加波動分析
  const maxScore = Math.max(...overallScores);
  const minScore = Math.min(...overallScores);
  const fluctuation = maxScore - minScore;

  if (fluctuation > 15) {
    conclusion += ` 測試結果波動較大（最高${maxScore}分，最低${minScore}分），建議檢查網站穩定性。`;
  } else if (fluctuation > 8) {
    conclusion += ` 測試結果有一定波動（最高${maxScore}分，最低${minScore}分），建議優化網站性能一致性。`;
  } else {
    conclusion += ` 測試結果穩定，波動範圍小（最高${maxScore}分，最低${minScore}分）。`;
  }

  conclusionText.textContent = conclusion;
}

// 更新指標顯示
function updateMetric(type, score) {
  document.getElementById(`${type}Value`).textContent = `${Math.round(
    score
  )}/100`;
  document.getElementById(`${type}Bar`).style.width = `${score}%`;

  let statusText = "";
  let statusClass = "";

  if (score >= 80) {
    statusText = "優秀";
    statusClass = "text-green-600";
  } else if (score >= 60) {
    statusText = "良好";
    statusClass = "text-yellow-600";
  } else {
    statusText = "需改進";
    statusClass = "text-red-600";
  }

  document.getElementById(`${type}Status`).textContent = statusText;
  document.getElementById(
    `${type}Status`
  ).className = `text-xs ${statusClass} mt-1`;
}

// 顯示優化建議
function displaySuggestions(suggestions) {
  const suggestionsContainer = document.getElementById("suggestions");
  suggestionsContainer.innerHTML = "";

  suggestions.forEach((suggestion, index) => {
    const suggestionDiv = document.createElement("div");
    suggestionDiv.className = "flex items-start";

    // 添加圖標
    let iconClass = "text-blue-500";
    if (index % 3 === 1) iconClass = "text-green-500";
    if (index % 3 === 2) iconClass = "text-yellow-500";

    suggestionDiv.innerHTML = `
            <div class="flex-shrink-0 pt-1">
                <i class="fas fa-lightbulb ${iconClass}"></i>
            </div>
            <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">${suggestion}</p>
            </div>
        `;

    suggestionsContainer.appendChild(suggestionDiv);
  });
}

// 事件監聽
singleTestBtn.addEventListener("click", () => analyzeSEO(false));
continuousTestBtn.addEventListener("click", runContinuousTests);

// 頁面加載時初始化
document.addEventListener("DOMContentLoaded", () => {
  // 設置默認URL
  websiteUrlInput.value = "example.com";
});
