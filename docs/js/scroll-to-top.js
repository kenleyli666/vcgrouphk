window.addEventListener("scroll", function () {
  const scrollToTopButton = document.querySelector(".scroll-to-top");
  const scrollPosition = window.scrollY;
  const windowHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  if (scrollPosition < windowHeight / 2) {
    scrollToTopButton.style.display = "none";
  } else {
    scrollToTopButton.style.display = "block";
  }
});

document
  .querySelector(".scroll-to-top")
  .addEventListener("click", function (event) {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
