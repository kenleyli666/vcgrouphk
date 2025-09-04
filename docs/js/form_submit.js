// 初始化 EmailJS
emailjs.init("U6f5V_sGnFKJSCH2J");

// 發送郵件函數
function sendEmail(name, email, phone, comment) {
  emailjs
    .send("service_b4jao93", "template_s429v2r", {
      name: name,
      email: email,
      phone: phone,
      comment: comment,
    })
    .then(
      function (result) {
        // 成功發送後清空表單
        document.getElementById("myForm").reset();
        // 顯示成功提示
        showAlert(alert("郵件已成功發送！"), "success");
      },
      function (error) {
        // 顯示錯誤提示
        showAlert(alert("郵件發送失敗，請稍後重試！"), "error");
        console.error("EmailJS Error:", error);
      }
    );
}

// 顯示提示訊息
function showAlert(message, type) {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert ${type}`;
  alertDiv.textContent = message;

  // 插入到表單前面
  const form = document.getElementById("myForm");
  form.parentNode.insertBefore(alertDiv, form);

  // 3秒後自動消失
  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}

// 表單驗證函數
function validateForm(name, email, phone, comment) {
  // 簡單的驗證規則
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name.trim()) {
    showAlert("請輸入您的姓名", "error");
    nameInput.focus();
    return false;
  }

  if (!emailRegex.test(email)) {
    showAlert("請輸入有效的電子郵件地址", "error");
    emailInput.focus();
    return false;
  }

  if (!phone.trim()) {
    showAlert("請輸入您的電話號碼", "error");
    phoneInput.focus();
    return false;
  }

  if (!comment.trim()) {
    showAlert("請輸入您的留言內容", "error");
    commentInput.focus();
    return false;
  }

  return true;
}

// 獲取DOM元素
const form = document.getElementById("myForm");
const nameInput = document.querySelector("input[name='name']");
const emailInput = document.querySelector("input[name='email']");
const phoneInput = document.querySelector("input[name='phone']");
const commentInput = document.querySelector("textarea[name='comment']");
const sendButton = document.querySelector("input[name='send']");

// 表單提交事件
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value;
  const email = emailInput.value;
  const phone = phoneInput.value;
  const comment = commentInput.value;

  // 先驗證表單
  if (validateForm(name, email, phone, comment)) {
    // 驗證通過後發送郵件
    sendEmail(name, email, phone, comment);
  }
});
