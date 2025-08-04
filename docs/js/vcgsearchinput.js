document.addEventListener("DOMContentLoaded", function () {
  const glassBtn = document.getElementById("glass-btn");
  const searchOverlay = document.getElementById("vcgSearchOverlay");
  const searchInput = document.getElementById("vcgSearchInput");
  const searchBtn = document.getElementById("vcgSearchBtn");
  const closeBtn = document.getElementById("vcgCloseSearch");

  // 显示搜索框
  glassBtn.addEventListener("click", function () {
    searchOverlay.style.display = "flex";
    setTimeout(() => searchInput.focus(), 100);
  });

  // 关闭搜索框
  closeBtn.addEventListener("click", function () {
    searchOverlay.style.display = "none";
  });

  // 核心搜索功能（完全排除导航栏）
  function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    // 清除之前的高亮
    document.querySelectorAll(".search-highlight").forEach((highlight) => {
      highlight.outerHTML = highlight.innerHTML;
    });

    // 搜索页面内容（排除所有导航栏）
    const elements = document.querySelectorAll(`
            body *:not(.navbar-one):not(.navbar-two):not(.navbar-one *):not(.navbar-two *)
        `);

    let found = false;
    const regExp = new RegExp(query, "gi");

    elements.forEach((el) => {
      // 只处理文本节点
      if (
        el.childNodes.length === 1 &&
        el.childNodes[0].nodeType === 3 &&
        el.textContent.match(regExp)
      ) {
        found = true;
        el.innerHTML = el.textContent.replace(
          regExp,
          (match) => `<span class="search-highlight">${match}</span>`
        );
      }
    });

    // 滚动到第一个匹配结果
    const firstHighlight = document.querySelector(".search-highlight");
    if (firstHighlight) {
      firstHighlight.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      searchOverlay.style.display = "none";
    }

    if (!found) {
      alert('未找到包含 "' + query + '" 的内容');
    }
  }

  // 点击搜索按钮
  searchBtn.addEventListener("click", performSearch);

  // 回车键搜索
  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      performSearch();
    }
  });
});
