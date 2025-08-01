// 初始化 EmailJS（✅ 改用环境变量）
emailjs.init(process.env.EMAILJS_PUBLIC_KEY); // 替换 "U6f5V_sGnFKJSCH2J"

// 发送邮件函数（✅ 改用环境变量）
function sendEmail(name, email, phone, comment) {
  emailjs
    .send(
      process.env.EMAILJS_SERVICE_ID, // 替换 "service_b4jao93"
      process.env.EMAILJS_TEMPLATE_ID, // 替换 "template_s429v2r"
      {
        name: name,
        email: email,
        phone: phone,
        comment: comment,
      }
    )
    .then(
      function (result) {
        document.getElementById("myForm").reset();
        showAlert("邮件已成功发送！", "success");
      },
      function (error) {
        showAlert("邮件发送失败，请稍后重试！", "error");
        console.error("EmailJS Error:", error);
      }
    );
}
