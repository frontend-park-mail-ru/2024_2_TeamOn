function renderModalStatusUpload(ok: any, media: any) {
  const modal: any = document.querySelector(`.push-modal`);
  modal.classList.add(`active`);
  modal.style.display = "block";
  if (ok) {
    modal.textContent = `${media} успешно применен`;
    modal.style.color = "green";
  } else {
    modal.textContent = "Произошла ошибка";
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
