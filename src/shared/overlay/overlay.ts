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
    console.log("overlay");
    overlay.remove();
    modal.style.display = "none";
    profileForm.classList.remove("blur");
    profileForm.classList.remove("blackout");
    if (document.body.style.overflow == "auto") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      const videoModal: any = document.querySelector(`.video-modal`);

      videoModal.pause();
    }
  });
  return overlay;
}

export { showOverlay };
