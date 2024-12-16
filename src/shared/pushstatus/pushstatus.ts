function renderModalStatusUpload(ok: any, message: any) {
  const modal: any = document.querySelector(`.push-modal`);
  modal.classList.add(`active`);
  modal.style.display = "flex";
  if (ok) {
    modal.textContent = message;
    modal.style.color = "green";
  } else {
    modal.textContent = message;
    modal.style.color = "red";
  }

  const hideModal = () => {
    modal.classList.remove("active");
    modal.style.display = "none";
    clearTimeout(timeoutId);
  };

  let timeoutId: any = setTimeout(hideModal, 3000);

  modal.addEventListener("mouseenter", () => {
    clearTimeout(timeoutId);
  });

  modal.addEventListener("mouseleave", () => {
    timeoutId = setTimeout(hideModal, 3000);
  });
  modal.addEventListener("click", () => {
    modal.classList.remove("active");
    modal.style.display = "none";
  });
}

export { renderModalStatusUpload };
