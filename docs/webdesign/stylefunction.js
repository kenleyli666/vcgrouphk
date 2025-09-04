/* START Nav 導航欄部分 */
document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link");
  const navIndicator = document.getElementById("nav-indicator");

  // 初始化函數
  function initNavIndicator() {
    // 確保橫線存在
    if (!navIndicator) {
      console.error("導航橫線元素未找到");
      return;
    }

    // 設置初始狀態
    const activeLink = document.querySelector(".nav-link.active");
    if (activeLink) {
      updateIndicator(activeLink);
    }

    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        const href = this.getAttribute("href");

        // 放行非锚链接（如../index.html）
        if (!href.startsWith("#")) return;

        // 仅对锚链接执行以下逻辑
        e.preventDefault();

        // 更新活动状态
        navLinks.forEach((l) => l.classList.remove("active", "text-blue-600"));
        this.classList.add("active", "text-blue-600");

        // 更新横线位置
        updateIndicator(this);

        // 平滑滚动到锚点
        const targetSection = document.querySelector(href);
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - 80,
            behavior: "smooth",
          });
          window.history.pushState(null, null, href);
        }
      });
    });
  }

  // 更新橫線位置函數
  function updateIndicator(activeLink) {
    if (!activeLink || !navIndicator) return;

    // 計算橫線位置和寬度
    const linkRect = activeLink.getBoundingClientRect();
    const containerRect = activeLink.parentElement.getBoundingClientRect();

    const left = linkRect.left - containerRect.left;
    const width = linkRect.width;

    // 應用新位置
    navIndicator.style.width = `${width}px`;
    navIndicator.style.left = `${left}px`;
  }

  // 監聽滾動事件以更新活動狀態
  window.addEventListener("scroll", function () {
    const fromTop = window.scrollY + 100;

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      // 只处理锚点链接（如 #services）
      if (href && href.startsWith("#")) {
        const section = document.querySelector(href);
        if (section) {
          if (
            section.offsetTop <= fromTop &&
            section.offsetTop + section.offsetHeight > fromTop
          ) {
            navLinks.forEach((l) =>
              l.classList.remove("active", "text-blue-600")
            );
            link.classList.add("active", "text-blue-600");
            updateIndicator(link);
          }
        }
      }
    });
  });

  // 初始化導航橫線
  initNavIndicator();
});
/* END Nav 導航欄部分 */

/* START 服務卡片 3 */
// 為光效卡片添加鼠標位置追蹤
document.querySelectorAll(".glow-card").forEach((card) => {
  card.addEventListener("mousemove", function (e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const glowOverlay = this.querySelector(".glow-overlay");
    // 增強光效強度和範圍
    glowOverlay.style.background = `radial-gradient(circle 150px at ${x}px ${y}px, 
            rgba(168, 85, 247, 0.9), rgba(168, 85, 247, 0) 70%)`;
    glowOverlay.style.opacity = "1";
  });

  card.addEventListener("mouseleave", function () {
    const glowOverlay = this.querySelector(".glow-overlay");
    glowOverlay.style.opacity = "0";
  });
});
/* END 服務卡片 3 */

/* START 作品集部分 */
document.addEventListener("DOMContentLoaded", function () {
  // 鼠標追蹤星星和光暈
  const halo = document.getElementById("halo");
  const stars = [];
  const starCount = 8;

  // 創建星星
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.className = "cursor-trail";
    star.innerHTML = '<div class="star"></div>';
    document.body.appendChild(star);
    stars.push({
      element: star,
      star: star.querySelector(".star"),
      x: 0,
      y: 0,
      delay: i * 0.1,
      scale: 0.5 + Math.random() * 0.5,
    });
  }

  // 鼠標移動事件
  document.addEventListener("mousemove", function (e) {
    // 更新光暈位置
    halo.style.left = e.clientX + "px";
    halo.style.top = e.clientY + "px";
    halo.style.transform = `translate(-50%, -50%) scale(1)`;
    halo.style.opacity = "1";

    // 更新星星位置
    stars.forEach((star, index) => {
      setTimeout(() => {
        star.x = e.clientX;
        star.y = e.clientY;
        star.element.style.left = star.x - 10 + "px";
        star.element.style.top = star.y - 10 + "px";

        // 星星動畫
        star.star.style.transform = `scale(${star.scale})`;
        star.star.style.opacity = "1";

        setTimeout(() => {
          star.star.style.transform = "scale(0)";
          star.star.style.opacity = "0";
        }, 300);
      }, index * 15);
    });
  });

  // 鼠標離開窗口時隱藏光暈
  document.addEventListener("mouseout", function () {
    halo.style.transform = `translate(-50%, -50%) scale(0)`;
    halo.style.opacity = "0";
  });

  // 當作品集區域進入視口時觸發
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 觸發金色粒子爆發效果
          createParticles();

          // 為每個標籤設置動畫延遲
          document.querySelectorAll(".tag-anim").forEach((tag) => {
            const delay = tag.getAttribute("data-delay");
            tag.style.animationDelay = delay + "s";
          });

          // 添加震動效果
          entry.target.classList.add("animate-sectionShake");
          setTimeout(() => {
            entry.target.classList.remove("animate-sectionShake");
          }, 1000);

          // 增強光暈效果
          halo.style.background =
            "radial-gradient(circle, rgba(255,215,0,0.5) 0%, rgba(255,215,0,0) 70%)";
          setTimeout(() => {
            halo.style.background =
              "radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(255,215,0,0) 70%)";
          }, 1000);
        }
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(document.querySelector("#portfolio"));

  // 創建金色粒子效果
  function createParticles() {
    const particles = [
      { class: "particle-1", count: 15, size: "w-2", color: "bg-yellow-400" },
      { class: "particle-2", count: 10, size: "w-3", color: "bg-yellow-300" },
      { class: "particle-3", count: 20, size: "w-1", color: "bg-amber-200" },
    ];

    particles.forEach((type) => {
      for (let i = 0; i < type.count; i++) {
        const particle = document
          .querySelector(`.particle-${type.class}`)
          .cloneNode(true);
        particle.classList.remove("opacity-0");
        particle.classList.add(type.size, type.color);

        // 隨機位置和動畫
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const tx = (Math.random() - 0.5) * 200;
        const ty = (Math.random() - 0.5) * 200;
        const tx2 = tx + (Math.random() - 0.5) * 100;
        const ty2 = ty + (Math.random() - 0.5) * 100;

        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.setProperty("--tx", `${tx}px`);
        particle.style.setProperty("--ty", `${ty}px`);
        particle.style.setProperty("--tx2", `${tx2}px`);
        particle.style.setProperty("--ty2", `${ty2}px`);
        particle.style.animation = `particleBurst 1.5s ease-out forwards`;

        document.querySelector("#portfolio").appendChild(particle);

        // 動畫結束後移除粒子
        setTimeout(() => {
          particle.remove();
        }, 1500);
      }
    });
  }
});
/* END 作品集部分 */

// 移動端菜單切換
const btn = document.querySelector(".mobile-menu-button");
const menu = document.querySelector(".mobile-menu");

btn.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});

// 關閉移動菜單當點擊鏈接
document.querySelectorAll(".mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.add("hidden");
  });
});

// 平滑滾動
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetSelector = this.getAttribute("href");
    if (targetSelector && targetSelector !== "#") {
      const targetElement = document.querySelector(targetSelector);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  });
});
