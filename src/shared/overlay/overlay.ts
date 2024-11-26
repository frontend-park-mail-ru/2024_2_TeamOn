function showOverlay(modal: any, profileForm: any) {
  document.body.style.overflowY = "hidden";
  document.body.style.overflowX = "hidden";

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "1001";
  document.body.appendChild(overlay);

  overlay.addEventListener("click", () => {
    overlay.remove();
    modal.style.display = "none";
    profileForm.classList.remove("blur");
    document.body.style.overflow = "auto";
  });
  return overlay;
}

export { showOverlay };
